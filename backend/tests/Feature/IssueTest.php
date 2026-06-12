<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class IssueTest extends TestCase
{
    use RefreshDatabase;

    public function test_api_issues_endpoint_returns_success(): void
    {
        Http::fake([
            'api.github.com/search/issues*' => Http::response([
                'total_count' => 1,
                'items' => [
                    [
                        'number' => 42,
                        'title' => 'Fix login button',
                        'repository_url' => 'https://api.github.com/repos/acme/demo',
                        'html_url' => 'https://github.com/acme/demo/issues/42',
                        'labels' => [['name' => 'good first issue']],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->getJson('/api/v1/issues');

        $response->assertOk();
        $response->assertJsonStructure([
            'data' => [
                '*' => ['number', 'title', 'repository', 'url', 'labels', 'difficulty', 'created_at'],
            ],
            'meta' => ['current_page', 'per_page', 'total'],
        ]);
        $response->assertJsonPath('data.0.number', 42);
        $response->assertJsonPath('data.0.difficulty', 'beginner');
    }

    public function test_api_issues_returns_502_when_github_fails(): void
    {
        Http::fake([
            'api.github.com/search/issues*' => Http::response([], 500),
        ]);

        $response = $this->getJson('/api/v1/issues');

        $response->assertStatus(502);
        $response->assertJsonPath('message', 'Failed to fetch issues from GitHub.');
    }

    public function test_repository_issues_endpoint_returns_formatted_data(): void
    {
        Http::fake([
            'api.github.com/repos/acme/demo/issues*' => Http::response([
                [
                    'id' => 1001,
                    'number' => 42,
                    'title' => 'Fix login button',
                    'state' => 'open',
                    'labels' => [['name' => 'bug']],
                    'user' => ['login' => 'alice', 'avatar_url' => 'https://avatars.example/alice.png'],
                    'comments' => 3,
                    'created_at' => '2026-01-15T10:00:00Z',
                    'html_url' => 'https://github.com/acme/demo/issues/42',
                ],
            ], 200),
        ]);

        $response = $this->getJson('/api/v1/repositories/acme/demo/issues');

        $response->assertOk();
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'number',
                    'title',
                    'state',
                    'labels',
                    'author' => ['login', 'avatar_url'],
                    'comments_count',
                    'created_at',
                    'html_url',
                ],
            ],
            'meta' => ['current_page', 'per_page', 'total'],
        ]);
        $response->assertJsonPath('data.0.id', 1001);
        $response->assertJsonPath('data.0.author.login', 'alice');
        $response->assertJsonPath('data.0.comments_count', 3);
    }

    public function test_repository_issues_excludes_pull_requests(): void
    {
        Http::fake([
            'api.github.com/repos/acme/demo/issues*' => Http::response([
                [
                    'id' => 1001,
                    'number' => 42,
                    'title' => 'Real issue',
                    'state' => 'open',
                    'labels' => [['name' => 'bug']],
                    'user' => ['login' => 'alice', 'avatar_url' => ''],
                    'comments' => 0,
                    'created_at' => '2026-01-15T10:00:00Z',
                    'html_url' => 'https://github.com/acme/demo/issues/42',
                ],
                [
                    'id' => 1002,
                    'number' => 43,
                    'title' => 'Pull request disguised as issue',
                    'state' => 'open',
                    'labels' => [['name' => 'good first issue']],
                    'user' => ['login' => 'bob', 'avatar_url' => ''],
                    'comments' => 0,
                    'created_at' => '2026-01-16T10:00:00Z',
                    'html_url' => 'https://github.com/acme/demo/pull/43',
                    'pull_request' => ['url' => 'https://api.github.com/repos/acme/demo/pulls/43'],
                ],
            ], 200),
        ]);

        $response = $this->getJson('/api/v1/repositories/acme/demo/issues');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.title', 'Real issue');
    }

    public function test_repository_issues_returns_404_when_repo_not_found(): void
    {
        Http::fake([
            'api.github.com/repos/unknown/missing/issues*' => Http::response([
                'message' => 'Not Found',
            ], 404),
        ]);

        $response = $this->getJson('/api/v1/repositories/unknown/missing/issues');

        $response->assertStatus(404);
        $response->assertJsonPath('message', 'Repository not found');
    }

    public function test_repository_issues_returns_429_on_rate_limit(): void
    {
        Http::fake([
            'api.github.com/repos/acme/demo/issues*' => Http::response([
                'message' => 'API rate limit exceeded',
            ], 403, ['X-RateLimit-Remaining' => '0']),
        ]);

        $response = $this->getJson('/api/v1/repositories/acme/demo/issues');

        $response->assertStatus(429);
        $response->assertJsonPath('message', 'GitHub API rate limit exceeded. Please try again later.');
    }
}
