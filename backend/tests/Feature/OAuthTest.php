<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Str;

class OAuthTest extends TestCase
{
    public function test_github_oauth_redirect_url_is_accessible()
    {
        $response = $this->get('/auth/github/redirect');

        $response->assertStatus(302);
        $this->assertStringContainsString('github.com', $response->getTargetUrl());
    }

    public function test_google_oauth_redirect_url_is_accessible()
    {
        $response = $this->get('/auth/google/redirect');

        $response->assertStatus(302);
        $this->assertStringContainsString('accounts.google.com', $response->getTargetUrl());
    }
}
