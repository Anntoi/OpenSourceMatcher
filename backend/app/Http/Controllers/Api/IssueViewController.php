<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\IssueView;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IssueViewController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->input('per_page', 50), 100);

        $views = $request->user()->issueViews()
            ->orderBy('viewed_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'data' => $views->items(),
            'meta' => [
                'current_page' => $views->currentPage(),
                'per_page' => $views->perPage(),
                'total' => $views->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'issue_number' => ['required', 'integer'],
            'title' => ['required', 'string', 'max:255'],
            'repository' => ['required', 'string', 'max:255'],
            'url' => ['required', 'url', 'max:500'],
            'labels' => ['nullable', 'array'],
            'difficulty' => ['required', 'in:beginner,intermediate,all-levels'],
        ]);

        $view = IssueView::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'issue_number' => $validated['issue_number'],
            ],
            [
                'title' => $validated['title'],
                'repository' => $validated['repository'],
                'url' => $validated['url'],
                'labels' => $validated['labels'] ?? [],
                'difficulty' => $validated['difficulty'],
                'viewed_at' => now(),
            ]
        );

        return response()->json([
            'data' => $view,
        ], 201);
    }

    public function destroy(Request $request, int $issueNumber): JsonResponse
    {
        $request->user()->issueViews()
            ->where('issue_number', $issueNumber)
            ->delete();

        return response()->json(['message' => 'View removed from history.']);
    }

    public function clear(Request $request): JsonResponse
    {
        $request->user()->issueViews()->delete();

        return response()->json(['message' => 'History cleared.']);
    }
}
