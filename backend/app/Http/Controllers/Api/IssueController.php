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

        foreach ($paginator->items() as $issue) {
            Issue::query()->updateOrCreate(
                ['repository' => $issue['repository'], 'number' => $issue['number']],
                $issue
            );
        }

        $issues = Issue::query()->whereIn('number', collect($paginator->items())->pluck('number'))->get()->sortByDesc('created_at')->values();

        return response()->json([
            'data' => IssueResource::collection($issues),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }
}
