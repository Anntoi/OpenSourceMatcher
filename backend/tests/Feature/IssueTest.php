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
}
