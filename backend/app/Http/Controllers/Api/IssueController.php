<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\GitHubApiException;
use App\Http\Controllers\Controller;
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

        return response()->json([
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    public function repositoryIssues(Request $request, string $owner, string $repo): JsonResponse
    {
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
        } catch (GitHubApiException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getStatusCode());
        } catch (Throwable $exception) {
            return response()->json([
                'message' => 'Failed to fetch issues from GitHub.',
            ], 502);
        }

        return response()->json([
            'data' => $result['items'],
            'meta' => [
                'current_page' => $validated['page'] ?? 1,
                'per_page' => $validated['per_page'] ?? 30,
                'total' => $result['total_count'],
            ],
        ]);
    }
}
