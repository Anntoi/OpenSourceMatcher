<?php

namespace App\Services;

use App\Exceptions\GitHubApiException;
use Illuminate\Http\Client\Response;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class GitHubService
{
    private const CACHE_TTL = 15 * 60; // 15 minutes
    private const TIMEOUT = 10; // seconds
    private const MAX_RETRIES = 3;

    public function searchIssues(int $page = 1, int $perPage = 10, ?string $difficulty = null, ?string $language = null, ?string $repo = null): LengthAwarePaginator
    {
        if ($repo) {
            // Search within a specific repository
            $query = "repo:{$repo} is:issue is:open archived:false (label:\"good first issue\" OR label:\"help wanted\")";
        } else {
            // Search across all of GitHub
            $query = "is:issue is:open archived:false (label:\"good first issue\" OR label:\"help wanted\")";
        }

        if ($language) {
            $query .= ' language:'.$language;
        }

        $cacheKey = 'github_issues:'.hash('sha256', $query.$page.$perPage);

        $cachedResult = Cache::get($cacheKey);
        if ($cachedResult) {
            $items = collect($cachedResult['items']);
            $total = $cachedResult['total'];
        } else {
            $items = collect();
            $total = 0;
            $lastException = null;

            for ($attempt = 0; $attempt < self::MAX_RETRIES; $attempt++) {
                try {
                    $response = $this->githubClient()->get('/search/issues', [
                        'q' => $query,
                        'sort' => 'created',
                        'order' => 'desc',
                        'page' => $page,
                        'per_page' => min($perPage, 100),
                    ]);

                    $this->throwOnFailedResponse($response);

                    $payload = $response->json();
                    $items = collect($payload['items'] ?? [])->map(function (array $item) {
                        $labels = collect($item['labels'] ?? [])->map(fn (array $label) => $label['name'])->values()->all();

                        return [
                            'number' => (int) $item['number'],
                            'title' => $item['title'],
                            'repository' => str($item['repository_url'] ?? '')->afterLast('repos/')->toString(),
                            'url' => $item['html_url'],
                            'labels' => $labels,
                            'difficulty' => $this->resolveDifficulty($labels),
                            'created_at' => $item['created_at'] ?? null,
                        ];
                    });
                    $total = (int) ($payload['total_count'] ?? $items->count());

                    Cache::put($cacheKey, [
                        'items' => $items->all(),
                        'total' => $total,
                    ], self::CACHE_TTL);

                    break;
                } catch (\Exception $e) {
                    $lastException = $e;
                    if ($attempt < self::MAX_RETRIES - 1) {
                        sleep(2 ** $attempt);
                    }
                }
            }

            if ($lastException && $items->isEmpty()) {
                throw $lastException;
            }
        }

        if ($difficulty) {
            $items = $items->filter(fn (array $item) => $item['difficulty'] === $difficulty)->values();
        }

        return new LengthAwarePaginator(
            items: $items->all(),
            total: $total,
            perPage: min($perPage, 30),
            currentPage: $page
        );
    }

    public function getRepositoryIssues(string $owner, string $repo, int $page = 1, int $perPage = 30): array
    {
        $cacheKey = "github_repo_issues:{$owner}:{$repo}:{$page}:".min($perPage, 100);

        $cached = Cache::get($cacheKey);
        if ($cached) {
            return $cached;
        }

        $lastException = null;

        for ($attempt = 0; $attempt < self::MAX_RETRIES; $attempt++) {
            try {
                $response = $this->githubClient()->get("/repos/{$owner}/{$repo}/issues", [
                    'state' => 'open',
                    'sort' => 'created',
                    'direction' => 'desc',
                    'page' => $page,
                    'per_page' => min($perPage, 100),
                ]);

                $this->throwOnFailedResponse($response);

                $payload = $response->json();

                $items = collect($payload ?? [])
                    ->filter(fn (array $issue) => ! isset($issue['pull_request']))
                    ->filter(fn (array $issue) => $this->hasQualifyingLabel($issue))
                    ->map(fn (array $issue) => $this->formatRepositoryIssue($issue))
                    ->values()
                    ->all();

                $result = [
                    'items' => $items,
                    'total_count' => count($items),
                ];

                Cache::put($cacheKey, $result, self::CACHE_TTL);

                return $result;
            } catch (GitHubApiException $e) {
                throw $e;
            } catch (\Exception $e) {
                $lastException = $e;
                if ($attempt < self::MAX_RETRIES - 1) {
                    sleep(2 ** $attempt);
                }
            }
        }

        if ($lastException) {
            throw $lastException;
        }

        return ['items' => [], 'total_count' => 0];
    }

    private function formatRepositoryIssue(array $issue): array
    {
        return [
            'id' => (int) $issue['id'],
            'number' => (int) $issue['number'],
            'title' => $issue['title'],
            'state' => $issue['state'],
            'labels' => collect($issue['labels'] ?? [])->map(fn (array $label) => $label['name'])->values()->all(),
            'author' => [
                'login' => $issue['user']['login'] ?? '',
                'avatar_url' => $issue['user']['avatar_url'] ?? '',
            ],
            'comments_count' => (int) ($issue['comments'] ?? 0),
            'created_at' => $issue['created_at'] ?? null,
            'html_url' => $issue['html_url'],
        ];
    }

    private function hasQualifyingLabel(array $issue): bool
    {
        $labels = collect($issue['labels'] ?? [])->map(fn (array $label) => str($label['name'])->lower()->toString())->values()->all();

        $qualifyingLabels = [
            'good first issue',
            'help wanted',
            'bug',
            'documentation',
        ];

        return collect($labels)->intersect($qualifyingLabels)->isNotEmpty();
    }

    public function getPopularRepositories(): array
    {
        $cacheKey = 'github_popular_repos';

        $cached = Cache::get($cacheKey);
        if ($cached) {
            return $cached;
        }

        $popularRepos = [
            ['owner' => 'laravel', 'repo' => 'framework'],
            ['owner' => 'facebook', 'repo' => 'react'],
            ['owner' => 'microsoft', 'repo' => 'vscode'],
            ['owner' => 'vercel', 'repo' => 'next.js'],
            ['owner' => 'golang', 'repo' => 'go'],
            ['owner' => 'python', 'repo' => 'cpython'],
            ['owner' => 'torvalds', 'repo' => 'linux'],
            ['owner' => 'kubernetes', 'repo' => 'kubernetes'],
        ];

        $repositories = [];

        foreach ($popularRepos as $repo) {
            try {
                $response = $this->githubClient()->get("/repos/{$repo['owner']}/{$repo['repo']}", []);

                $this->throwOnFailedResponse($response);

                $data = $response->json();

                $repositories[] = [
                    'owner' => $repo['owner'],
                    'repo' => $repo['repo'],
                    'full_name' => $data['full_name'] ?? "{$repo['owner']}/{$repo['repo']}",
                    'description' => $data['description'] ?? '',
                    'open_issues_count' => (int) ($data['open_issues_count'] ?? 0),
                    'stars' => (int) ($data['stargazers_count'] ?? 0),
                    'language' => $data['language'] ?? '',
                    'url' => $data['html_url'] ?? '',
                    'avatar_url' => $data['owner']['avatar_url'] ?? '',
                ];
            } catch (\Exception $e) {
                // Skip repository on error
                continue;
            }
        }

        Cache::put($cacheKey, $repositories, self::CACHE_TTL);

        return $repositories;
    }

    public function getPopularRepositoriesWithIssues(): array
    {
        $cacheKey = 'github_popular_repos_with_issues';

        $cached = Cache::get($cacheKey);
        if ($cached) {
            return $cached;
        }

        $repositories = $this->getPopularRepositories();
        $repositoriesWithIssues = [];

        foreach ($repositories as $repo) {
            try {
                $issues = $this->getRepositoryIssues(
                    $repo['owner'],
                    $repo['repo'],
                    page: 1,
                    perPage: 3
                );

                $repositoriesWithIssues[] = array_merge($repo, [
                    'issues' => $issues['items'],
                ]);
            } catch (\Exception $e) {
                // Skip if we can't fetch issues
                $repositoriesWithIssues[] = array_merge($repo, [
                    'issues' => [],
                ]);
            }
        }

        Cache::put($cacheKey, $repositoriesWithIssues, self::CACHE_TTL);

        return $repositoriesWithIssues;
    }

    private function githubClient()
    {
        return Http::withHeaders([
            'Accept' => 'application/vnd.github+json',
            'X-GitHub-Api-Version' => '2022-11-28',
        ])->when(
            config('services.github.token'),
            fn ($client) => $client->withToken(config('services.github.token'))
        )->timeout(self::TIMEOUT)->baseUrl(rtrim(config('services.github.api_url', 'https://api.github.com'), '/'));
    }

    private function throwOnFailedResponse(Response $response): void
    {
        if (! $response->failed()) {
            return;
        }

        if ($response->status() === 404) {
            throw GitHubApiException::repositoryNotFound();
        }

        if ($response->status() === 403 && $this->isRateLimitExceeded($response)) {
            throw GitHubApiException::rateLimitExceeded();
        }

        if ($response->status() === 429) {
            throw GitHubApiException::rateLimitExceeded();
        }

        throw GitHubApiException::apiError($response->status());
    }

    private function isRateLimitExceeded(Response $response): bool
    {
        $remaining = $response->header('X-RateLimit-Remaining');
        if ($remaining !== null && (int) $remaining === 0) {
            return true;
        }

        $body = $response->json();
        $message = is_array($body) ? ($body['message'] ?? '') : '';

        return str_contains(strtolower($message), 'rate limit');
    }

    private function resolveDifficulty(array $labels): string
    {
        $labelsCollection = Collection::make($labels)->map(fn (string $label) => str($label)->lower()->toString());

        return match (true) {
            $labelsCollection->contains('good first issue') => 'beginner',
            $labelsCollection->contains('help wanted') => 'intermediate',
            default => 'all-levels',
        };
    }
}
