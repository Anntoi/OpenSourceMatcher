<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FavoriteResource;
use App\Models\Favorite;
use App\Models\Issue;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min((int) $request->input('per_page', 10), 100);

        $favorites = $request->user()->favorites()->latest()->paginate($perPage);

        return FavoriteResource::collection($favorites);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'issue_number' => ['required', 'integer'],
            'title' => ['required', 'string', 'max:255'],
            'repository' => ['required', 'string', 'max:255'],
            'url' => ['required', 'url', 'max:500'],
            'labels' => ['nullable', 'array'],
            'difficulty' => ['required', 'in:beginner,intermediate,all-levels'],
        ]);

        // Ensure issue exists (or will be created via GitHub API)
        Issue::query()->updateOrCreate(
            [
                'repository' => $validated['repository'],
                'number' => $validated['issue_number'],
            ],
            [
                'title' => $validated['title'],
                'url' => $validated['url'],
                'labels' => $validated['labels'] ?? [],
                'difficulty' => $validated['difficulty'],
            ]
        );

        $favorite = Favorite::query()->updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'issue_number' => $validated['issue_number'],
            ],
            $validated + ['user_id' => $request->user()->id]
        );

        return (new FavoriteResource($favorite))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function destroy(Request $request, int $issueNumber)
    {
        $request->user()->favorites()->where('issue_number', $issueNumber)->delete();

        return response()->json(['message' => 'Favorite removed.']);
    }
}

