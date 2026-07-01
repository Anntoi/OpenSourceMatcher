<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\Response;

class SocialAuthController extends Controller
{
    private const PROVIDERS = ['github', 'google'];

    public function redirect(string $provider): RedirectResponse
    {
        $this->ensureValidProvider($provider);

        try {
            Log::info('OAuth redirect attempt', ['provider' => $provider]);
            $redirect = Socialite::driver($provider)
                ->stateless()
                ->redirect();
            Log::info('OAuth redirect success', ['provider' => $provider]);
            return $redirect;
        } catch (\Throwable $exception) {
            Log::error('OAuth redirect failed', [
                'provider' => $provider,
                'message' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
            ]);

            throw $exception;
        }
    }

    public function callback(string $provider): RedirectResponse
    {
        $this->ensureValidProvider($provider);

        Log::info('OAuth callback attempt', ['provider' => $provider]);

        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
            Log::info('OAuth user retrieved', ['provider' => $provider, 'email' => $socialUser->getEmail()]);
        } catch (\Throwable $exception) {
            Log::error('OAuth callback failed', [
                'provider' => $provider,
                'message' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
            ]);

            return $this->redirectToFrontend(['error' => 'oauth_failed']);
        }

        if (! $socialUser->getEmail()) {
            return $this->redirectToFrontend(['error' => 'email_required']);
        }

        $user = User::query()
            ->where('provider', $provider)
            ->where('provider_id', (string) $socialUser->getId())
            ->first();

        if (! $user) {
            $user = User::query()->where('email', $socialUser->getEmail())->first();
        }

        $attributes = [
            'name' => $socialUser->getName() ?? $socialUser->getNickname() ?? 'Utilisateur',
            'email' => $socialUser->getEmail(),
            'provider' => $provider,
            'provider_id' => (string) $socialUser->getId(),
            'avatar' => $socialUser->getAvatar(),
            'email_verified_at' => now(),
            'password' => Str::password(32),
        ];

        if ($user) {
            unset($attributes['password']);
            $user->update($attributes);
        } else {
            $user = User::query()->create($attributes);
        }

        $token = $user->createToken('oauth_'.$provider)->plainTextToken;

        return $this->redirectToFrontend(['token' => $token]);
    }

    private function ensureValidProvider(string $provider): void
    {
        abort_unless(in_array($provider, self::PROVIDERS, true), Response::HTTP_NOT_FOUND);
    }

    private function redirectToFrontend(array $params): RedirectResponse
    {
        $base = rtrim(config('services.frontend.url', 'https://opensourcematcher.vercel.app'), '/');
        $query = http_build_query($params);

        return redirect("{$base}/auth/callback?{$query}");
    }
}
