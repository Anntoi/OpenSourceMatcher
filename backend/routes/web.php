<?php

use App\Http\Controllers\Auth\SocialAuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test-config', function () {
    return response()->json([
        'github_client_id' => env('GITHUB_CLIENT_ID') ? 'SET' : 'NOT SET',
        'github_client_secret' => env('GITHUB_CLIENT_SECRET') ? 'SET' : 'NOT SET',
        'github_redirect' => env('GITHUB_REDIRECT_URI'),
        'google_client_id' => env('GOOGLE_CLIENT_ID') ? 'SET' : 'NOT SET',
        'google_client_secret' => env('GOOGLE_CLIENT_SECRET') ? 'SET' : 'NOT SET',
        'google_redirect' => env('GOOGLE_REDIRECT_URI'),
        'frontend_url' => env('FRONTEND_URL'),
    ]);
});

Route::get('/auth/{provider}/redirect', [SocialAuthController::class, 'redirect'])
    ->whereIn('provider', ['github', 'google']);

Route::get('/auth/{provider}/callback', [SocialAuthController::class, 'callback'])
    ->whereIn('provider', ['github', 'google']);
