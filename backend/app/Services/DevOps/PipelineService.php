<?php

namespace App\Services\DevOps;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Config;
use Exception;

class PipelineService
{
    private $token;
    private $repoOwner;
    private $repoName;

    public function __construct()
    {
        $this->token = Config::get('services.github.token');
        $this->repoOwner = Config::get('services.github.repo_owner', 'opensourcematcher');
        $this->repoName = Config::get('services.github.repo_name', 'OpenSourceMatcher');
    }

    /**
     * Récupère tous les workflows GitHub Actions
     */
    public function getPipelines(int $limit = 20): array
    {
        if (!$this->token) {
            return $this->getMockPipelines();
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'token ' . $this->token,
                'Accept' => 'application/vnd.github.v3+json',
            ])->timeout(10)->get(
                "https://api.github.com/repos/{$this->repoOwner}/{$this->repoName}/actions/runs",
                ['per_page' => $limit]
            );

            if (!$response->successful()) {
                return $this->getMockPipelines();
            }

            return $this->formatPipelines($response->json()['workflow_runs'] ?? []);
        } catch (Exception $e) {
            return $this->getMockPipelines();
        }
    }

    /**
     * Formate les pipelines GitHub en format standardisé
     */
    private function formatPipelines(array $runs): array
    {
        return collect($runs)->map(function ($run) {
            return [
                'id' => $run['id'],
                'name' => $run['name'] ?? 'Unknown',
                'status' => $this->normalizeStatus($run['status'] ?? 'unknown'),
                'conclusion' => $run['conclusion'] ?? null,
                'branch' => $run['head_branch'] ?? 'unknown',
                'commit' => substr($run['head_commit']['sha'] ?? '', 0, 7),
                'author' => $run['actor']['login'] ?? 'unknown',
                'started_at' => $run['created_at'] ?? null,
                'updated_at' => $run['updated_at'] ?? null,
                'duration' => $this->calculateDuration($run['created_at'] ?? null, $run['updated_at'] ?? null),
                'url' => $run['html_url'] ?? null,
            ];
        })->toArray();
    }

    /**
     * Normalise le statut GitHub en statut standardisé
     */
    private function normalizeStatus(string $status): string
    {
        return match ($status) {
            'completed' => 'completed',
            'in_progress' => 'running',
            'queued' => 'pending',
            'requested' => 'pending',
            'waiting' => 'pending',
            default => 'unknown',
        };
    }

    /**
     * Calcule la durée d'un workflow
     */
    private function calculateDuration(?string $startedAt, ?string $updatedAt): ?string
    {
        if (!$startedAt || !$updatedAt) {
            return null;
        }

        try {
            $start = \Carbon\Carbon::parse($startedAt);
            $end = \Carbon\Carbon::parse($updatedAt);
            $minutes = $end->diffInMinutes($start);

            if ($minutes < 1) {
                return $end->diffInSeconds($start) . 's';
            } elseif ($minutes < 60) {
                return $minutes . 'm';
            }

            $hours = $end->diffInHours($start);
            return $hours . 'h ' . ($minutes % 60) . 'm';
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * Pipelines simulés pour tests
     */
    private function getMockPipelines(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'CI/CD Pipeline',
                'status' => 'completed',
                'conclusion' => 'success',
                'branch' => 'main',
                'commit' => 'a1b2c3d',
                'author' => 'john-dev',
                'started_at' => now()->subHours(2)->toIso8601String(),
                'updated_at' => now()->subHours(1)->toIso8601String(),
                'duration' => '45m 30s',
                'url' => '#',
            ],
            [
                'id' => 2,
                'name' => 'Tests',
                'status' => 'completed',
                'conclusion' => 'success',
                'branch' => 'develop',
                'commit' => 'e4f5g6h',
                'author' => 'jane-dev',
                'started_at' => now()->subHours(4)->toIso8601String(),
                'updated_at' => now()->subHours(3)->toIso8601String(),
                'duration' => '12m 15s',
                'url' => '#',
            ],
            [
                'id' => 3,
                'name' => 'Build Docker',
                'status' => 'running',
                'conclusion' => null,
                'branch' => 'feature/devops',
                'commit' => 'i7j8k9l',
                'author' => 'bob-dev',
                'started_at' => now()->subMinutes(5)->toIso8601String(),
                'updated_at' => now()->subMinutes(1)->toIso8601String(),
                'duration' => '5m 20s',
                'url' => '#',
            ],
            [
                'id' => 4,
                'name' => 'Deploy Staging',
                'status' => 'completed',
                'conclusion' => 'failure',
                'branch' => 'develop',
                'commit' => 'm1n2o3p',
                'author' => 'alice-dev',
                'started_at' => now()->subHours(8)->toIso8601String(),
                'updated_at' => now()->subHours(7)->toIso8601String(),
                'duration' => '8m',
                'url' => '#',
            ],
        ];
    }

    /**
     * Récupère les détails d'un pipeline spécifique
     */
    public function getPipelineDetail(int $runId): array
    {
        // À implémenter avec l'API GitHub si nécessaire
        return [];
    }
}
