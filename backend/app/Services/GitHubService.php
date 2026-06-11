<?php

namespace App\Services;

use Illuminate\Http\Client\RequestException;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class GitHubService
{
    private const CACHE_TTL = 15 * 60; // 15 minutes
    private const TIMEOUT = 10; // seconds
    private const MAX_RETRIES = 3;

    public function searchIssues(int $page = 1, int $perPage = 10, ?string $difficulty = null, ?string $language = null): LengthAwarePaginator
    {
        $repoOwner = config('services.github.repo_owner', 'opensourcematcher');
        $repoName = config('services.github.repo_name', 'OpenSourceMatcher');
        $query = "repo:{$repoOwner}/{$repoName} is:issue is:open archived:false (label:\"good first issue\" OR label:\"help wanted\")";

        if ($language) {
            $query .= ' language:'.$language;
        }

        // Generate cache key based on query parameters
        $cacheKey = 'github_issues:'.hash('sha256', $query.$page.$perPage);

        // Try to get from cache
        $cachedResult = Cache::get($cacheKey);
        if ($cachedResult) {
            $items = $cachedResult['items'];
            $total = $cachedResult['total'];
        } else {
            // Fetch from GitHub with retry logic
            $items = [];
            $total = 0;
            $lastException = null;

            for ($attempt = 0; $attempt < self::MAX_RETRIES; $attempt++) {
                try {
                    $response = Http::withHeaders([
                        'Accept' => 'application/vnd.github+json',
                        'X-GitHub-Api-Version' => '2022-11-28',
                    ])->when(
                        config('services.github.token'),
                        fn ($client) => $client->withToken(config('services.github.token'))
                    )->timeout(self::TIMEOUT)->get('https://api.github.com/search/issues', [
                        'q' => $query,
                        'sort' => 'created',
                        'order' => 'desc',
                        'page' => $page,
                        'per_page' => min($perPage, 30),
                    ]);

                    throw_if($response->failed(), RequestException::class, $response);

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
                    })->all();
                    $total = (int) ($payload['total_count'] ?? $items->count());

                    // Cache the result
                    Cache::put($cacheKey, [
                        'items' => $items,
                        'total' => $total,
                    ], self::CACHE_TTL);

                    break;
                } catch (\Exception $e) {
                    $lastException = $e;
                    if ($attempt < self::MAX_RETRIES - 1) {
                        // Exponential backoff: 1s, 2s, 4s
                        sleep(2 ** $attempt);
                    }
                }
            }

            if ($lastException && empty($items)) {
                throw $lastException;
            }
        }

        if ($difficulty) {
            $items = $items->filter(fn (array $item) => $item['difficulty'] === $difficulty)->values();
        }

        return new LengthAwarePaginator(
            items: $items,
            total: $total,
            perPage: min($perPage, 30),
            currentPage: $page
        );
    }

    public function getRepositoryIssues(?string $owner = null, ?string $repo = null, int $page = 1, int $perPage = 30): array
    {
        // Use default values from config if not provided
        if ($owner === null) {
            $owner = config('services.github.repo_owner', 'opensourcematcher');
        }
        if ($repo === null) {
            $repo = config('services.github.repo_name', 'OpenSourceMatcher');
        }

        $lastException = null;

        for ($attempt = 0; $attempt < self::MAX_RETRIES; $attempt++) {
            try {
                $response = Http::withHeaders([
                    'Accept' => 'application/vnd.github+json',
                    'X-GitHub-Api-Version' => '2022-11-28',
                ])->when(
                    config('services.github.token'),
                    fn ($client) => $client->withToken(config('services.github.token'))
                )->timeout(self::TIMEOUT)->get("https://api.github.com/repos/{$owner}/{$repo}/issues", [
                    'state' => 'open',
                    'sort' => 'created',
                    'order' => 'desc',
                    'page' => $page,
                    'per_page' => min($perPage, 100), // GitHub allows max 100 per page
                ]);

                if ($response->failed()) {
                    if ($response->status() === 404) {
                        throw new \Exception("Repository not found", 404);
                    }
                    throw new \Exception("GitHub API error: {$response->status()}", $response->status());
                }

                $payload = $response->json();

                $items = collect($payload ?? [])->map(function (array $issue) {
                    return [
                        'id' => (int) $issue['id'],
                        'title' => $issue['title'],
                        'state' => $issue['state'],
                        'labels' => collect($issue['labels'] ?? [])->map(fn (array $label) => $label['name'])->values()->all(),
                        'author' => [
                            'login' => $issue['user']['login'] ?? '',
                            'avatar_url' => $issue['user']['avatar_url'] ?? '',
                        ],
                        'comments_count' => (int) $issue['comments'],
                        'created_at' => $issue['created_at'] ?? null,
                        'html_url' => $issue['html_url'],
                    ];
                })->all();

                return [
                    'items' => $items,
                    'total_count' => count($items), // Note: GitHub doesn't provide total count for this endpoint without pagination headers
                    // For simplicity, we're returning the count of items on this page
                    // In a real implementation, we'd parse the Link header for total count
                ];
            } catch (\Exception $e) {
                $lastException = $e;
                if ($attempt < self::MAX_RETRIES - 1) {
                    // Exponential backoff: 1s, 2s, 4s
                    sleep(2 ** $attempt);
                }
            }
        }

        if ($lastException) {
            throw $lastException;
        }

        return ['items' => [], 'total_count' => 0];
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