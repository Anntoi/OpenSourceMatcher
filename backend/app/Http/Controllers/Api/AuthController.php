<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user = User::query()->where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $token = $user->createToken($validated['device_name'] ?? 'web_client')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'token' => $token,
            'user' => new UserResource($user),
        ]);
    }

    public function me(): JsonResponse
    {
        return response()->json(new UserResource(auth()->user()));
    }

    public function logout(): JsonResponse
    {
        auth()->user()?->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }
}
