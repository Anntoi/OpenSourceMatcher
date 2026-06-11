<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\IssueResource;
use App\Models\Issue;
use App\Services\GitHubService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class IssueController extends Controller
{
    public function __construct(private readonly GitHubService $gitHubService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:30'],
            'difficulty' => ['nullable', 'in:beginner,intermediate,all-levels'],
            'language' => ['nullable', 'string', 'max:30'],
        ]);

        try {
            $paginator = $this->gitHubService->searchIssues(
                page: $validated['page'] ?? 1,
                perPage: $validated['per_page'] ?? 10,
                difficulty: $validated['difficulty'] ?? null,
                language: $validated['language'] ?? null
            );
        } catch (Throwable $exception) {
            return response()->json([
                'message' => 'Failed to fetch issues from GitHub.',
            ], 502);
        }

        // Return the items directly in the format expected by the frontend
        return response()->json([
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    public function repositoryIssues(Request $request): JsonResponse
    {
        // Get owner and repo from route parameters, with fallback to config defaults
        $owner = $request->route('owner') ?? config('services.github.repo_owner', 'opensourcematcher');
        $repo = $request->route('repo') ?? config('services.github.repo_name', 'OpenSourceMatcher');
        
        $validated = $request->validate([
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        try {
            $result = $this->gitHubService->getRepositoryIssues(
                $owner,
                $repo,
                $validated['page'] ?? 1,
                $validated['per_page'] ?? 30
            );
        } catch (\Exception $e) {
            // Handle specific GitHub errors
            if ($e->getMessage() === 'Repository not found') {
                return response()->json([
                    'message' => 'Repository not found',
                ], 404);
            }

            if (preg_match('/GitHub API error: (\d+)/', $e->getMessage(), $matches)) {
                $statusCode = (int) $matches[1];
                if ($statusCode === 403) {
                    // Rate limit exceeded
                    return response()->json([
                        'message' => 'GitHub API rate limit exceeded. Please try again later.',
                    ], 429);
                }

                return response()->json([
                    'message' => 'GitHub API error: ' . $e->getMessage(),
                ], $statusCode);
            }

            return response()->json([
                'message' => 'Failed to fetch issues from GitHub.',
            ], 502);
        }

        // Format response according to specification
        $formattedItems = collect($result['items'])->map(function ($item) {
            return $item; // Already formatted in the service
        })->all();

        return response()->json([
            'issues' => $formattedItems,
            'total_count' => $result['total_count'],
            'page' => $validated['page'] ?? 1,
            'per_page' => $validated['per_page'] ?? 30,
        ]);
    }
}
