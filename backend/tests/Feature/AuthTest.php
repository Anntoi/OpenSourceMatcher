<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_with_valid_credentials(): void
    {
        User::factory()->create([
            'email' => 'dev@example.com',
            'password' => Hash::make('password'),
        ]);

        $response = $this->postJson('/api/v1/login', [
            'email' => 'dev@example.com',
            'password' => 'password',
        ]);

        $response->assertOk();
        $response->assertJsonStructure(['message', 'token', 'user' => ['email', 'name']]);
    }

    public function test_login_fails_with_invalid_credentials(): void
    {
        User::factory()->create([
            'email' => 'dev@example.com',
            'password' => Hash::make('password'),
        ]);

        $response = $this->postJson('/api/v1/login', [
            'email' => 'dev@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertUnprocessable();
        $response->assertJsonPath('message', 'Invalid credentials.');
    }

    public function test_authenticated_user_can_access_profile(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/me');

        $response->assertOk();
        $response->assertJsonPath('email', $user->email);
    }

    public function test_non_admin_cannot_access_devops_routes(): void
    {
        Sanctum::actingAs(User::factory()->create(['is_admin' => false]));

        $response = $this->getJson('/api/v1/devops/dashboard');

        $response->assertForbidden();
    }

    public function test_admin_can_access_devops_routes(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $response = $this->getJson('/api/v1/devops/dashboard');

        $response->assertOk();
        $response->assertJsonPath('status', 'success');
    }
}
