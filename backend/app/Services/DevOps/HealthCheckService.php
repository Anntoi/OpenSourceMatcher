<?php

namespace App\Services\DevOps;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Config;
use Exception;

class HealthCheckService
{
    private const CACHE_TTL = 300; // 5 minutes

    /**
     * Récupère l'état de santé global de l'application
     */
    public function getHealthStatus(): array
    {
        return [
            'backend' => $this->checkBackendHealth(),
            'database' => $this->checkDatabaseHealth(),
            'github_api' => $this->checkGitHubApiHealth(),
            'docker' => $this->checkDockerHealth(),
        ];
    }

    /**
     * Vérifie la santé du backend Laravel
     */
    private function checkBackendHealth(): array
    {
        $startTime = microtime(true);
        
        try {
            // Test simple de la base de données
            DB::connection()->getPdo();
            $responseTime = (microtime(true) - $startTime) * 1000;
            
            return [
                'name' => 'Backend API',
                'status' => 'online',
                'response_time' => round($responseTime, 2),
                'message' => 'Laravel API is running',
                'last_check' => now()->toIso8601String(),
            ];
        } catch (Exception $e) {
            $responseTime = (microtime(true) - $startTime) * 1000;
            
            return [
                'name' => 'Backend API',
                'status' => 'offline',
                'response_time' => round($responseTime, 2),
                'message' => 'Backend API is down: ' . $e->getMessage(),
                'last_check' => now()->toIso8601String(),
            ];
        }
    }

    /**
     * Vérifie la santé de PostgreSQL
     */
    private function checkDatabaseHealth(): array
    {
        $startTime = microtime(true);
        
        try {
            $result = DB::select('SELECT NOW()');
            $responseTime = (microtime(true) - $startTime) * 1000;
            
            return [
                'name' => 'PostgreSQL Database',
                'status' => 'online',
                'response_time' => round($responseTime, 2),
                'message' => 'Database connection successful',
                'last_check' => now()->toIso8601String(),
            ];
        } catch (Exception $e) {
            $responseTime = (microtime(true) - $startTime) * 1000;
            
            return [
                'name' => 'PostgreSQL Database',
                'status' => 'offline',
                'response_time' => round($responseTime, 2),
                'message' => 'Database connection failed: ' . $e->getMessage(),
                'last_check' => now()->toIso8601String(),
            ];
        }
    }

    /**
     * Vérifie la santé de l'API GitHub
     */
    private function checkGitHubApiHealth(): array
    {
        $startTime = microtime(true);
        $token = Config::get('services.github.token');
        
        if (!$token) {
            $responseTime = (microtime(true) - $startTime) * 1000;
            
            return [
                'name' => 'GitHub API',
                'status' => 'unavailable',
                'response_time' => round($responseTime, 2),
                'message' => 'GitHub token not configured',
                'last_check' => now()->toIso8601String(),
            ];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'token ' . $token,
                'Accept' => 'application/vnd.github.v3+json',
            ])->timeout(5)->get('https://api.github.com/user');

            $responseTime = (microtime(true) - $startTime) * 1000;

            if ($response->successful()) {
                return [
                    'name' => 'GitHub API',
                    'status' => 'online',
                    'response_time' => round($responseTime, 2),
                    'message' => 'GitHub API is accessible',
                    'last_check' => now()->toIso8601String(),
                ];
            }

            return [
                'name' => 'GitHub API',
                'status' => 'offline',
                'response_time' => round($responseTime, 2),
                'message' => 'GitHub API returned error: ' . $response->status(),
                'last_check' => now()->toIso8601String(),
            ];
        } catch (Exception $e) {
            $responseTime = (microtime(true) - $startTime) * 1000;
            
            return [
                'name' => 'GitHub API',
                'status' => 'offline',
                'response_time' => round($responseTime, 2),
                'message' => 'GitHub API unreachable: ' . $e->getMessage(),
                'last_check' => now()->toIso8601String(),
            ];
        }
    }

    /**
     * Vérifie la santé de Docker lorsque DOCKER_HOST est configuré.
     */
    private function checkDockerHealth(): array
    {
        $startTime = microtime(true);
        $dockerHost = Config::get('services.docker.host');

        if (! $dockerHost) {
            return [
                'name' => 'Docker',
                'status' => 'unconfigured',
                'response_time' => round((microtime(true) - $startTime) * 1000, 2),
                'message' => 'DOCKER_HOST not set — Docker health check skipped',
                'last_check' => now()->toIso8601String(),
            ];
        }

        try {
            $responseTime = (microtime(true) - $startTime) * 1000;

            if (str_starts_with($dockerHost, 'unix://')) {
                $socketPath = substr($dockerHost, 7);
                $socketExists = file_exists($socketPath);

                return [
                    'name' => 'Docker',
                    'status' => $socketExists ? 'online' : 'offline',
                    'response_time' => round($responseTime, 2),
                    'message' => $socketExists
                        ? 'Docker socket found at '.$socketPath
                        : 'Docker socket not found at '.$socketPath,
                    'last_check' => now()->toIso8601String(),
                ];
            }

            $response = Http::timeout(5)->get(rtrim($dockerHost, '/').'/_ping');

            return [
                'name' => 'Docker',
                'status' => $response->successful() ? 'online' : 'offline',
                'response_time' => round((microtime(true) - $startTime) * 1000, 2),
                'message' => $response->successful()
                    ? 'Docker daemon is reachable'
                    : 'Docker daemon returned error: '.$response->status(),
                'last_check' => now()->toIso8601String(),
            ];
        } catch (Exception $e) {
            return [
                'name' => 'Docker',
                'status' => 'offline',
                'response_time' => round((microtime(true) - $startTime) * 1000, 2),
                'message' => 'Docker daemon unreachable: '.$e->getMessage(),
                'last_check' => now()->toIso8601String(),
            ];
        }
    }

    /**
     * Retourne un statut global simplifié
     */
    public function getGlobalStatus(): array
    {
        $health = $this->getHealthStatus();
        $allOnline = collect($health)->every(
            fn ($service) => in_array($service['status'], ['online', 'unconfigured'], true)
        );
        
        return [
            'status' => $allOnline ? 'healthy' : 'degraded',
            'services' => $health,
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
