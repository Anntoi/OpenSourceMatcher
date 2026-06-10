<?php

namespace App\Services\DevOps;

class DeploymentService
{
    /**
     * Récupère l'historique des déploiements
     */
    public function getDeployments(int $limit = 20): array
    {
        // À implémenter : récupérer depuis la base de données ou fichier logs
        return $this->getMockDeployments($limit);
    }

    /**
     * Enregistre un nouveau déploiement
     */
    public function createDeployment(array $data): array
    {
        // À implémenter : sauvegarder en base de données
        return $data;
    }

    /**
     * Déploiements simulés
     */
    private function getMockDeployments(int $limit): array
    {
        $environments = ['production', 'staging', 'development'];
        $statuses = ['success', 'in_progress', 'failed', 'pending'];

        $deployments = [];

        for ($i = 0; $i < $limit; $i++) {
            $status = $statuses[array_rand($statuses)];
            $deployments[] = [
                'id' => uniqid(),
                'version' => '1.' . rand(0, 5) . '.' . rand(0, 20),
                'environment' => $environments[array_rand($environments)],
                'status' => $status,
                'branch' => $status === 'failed' ? 'hotfix/bug-' . rand(1, 5) : ($i % 3 === 0 ? 'develop' : 'main'),
                'commit' => substr(md5(uniqid()), 0, 7),
                'author' => ['john-dev', 'jane-dev', 'bob-dev', 'alice-dev'][array_rand(['john-dev', 'jane-dev', 'bob-dev', 'alice-dev'])],
                'started_at' => now()->subHours(rand(1, 72))->toIso8601String(),
                'completed_at' => now()->subHours(rand(0, 71))->toIso8601String(),
                'duration' => rand(30, 600) . 's',
                'message' => $this->getDeploymentMessage($status),
            ];
        }

        return collect($deployments)
            ->sortByDesc('started_at')
            ->values()
            ->toArray();
    }

    /**
     * Message de déploiement selon le statut
     */
    private function getDeploymentMessage(string $status): string
    {
        return match ($status) {
            'success' => 'Deployment completed successfully',
            'in_progress' => 'Deployment in progress...',
            'failed' => 'Deployment failed during build phase',
            'pending' => 'Deployment queued',
            default => 'Unknown status',
        };
    }

    /**
     * Récupère les statistiques de déploiements
     */
    public function getDeploymentStats(): array
    {
        $deployments = $this->getMockDeployments(100);

        $successful = collect($deployments)->filter(fn($d) => $d['status'] === 'success')->count();
        $failed = collect($deployments)->filter(fn($d) => $d['status'] === 'failed')->count();

        return [
            'total_deployments' => count($deployments),
            'successful' => $successful,
            'failed' => $failed,
            'success_rate' => count($deployments) > 0 ? round(($successful / count($deployments)) * 100, 2) : 0,
            'average_duration' => $this->calculateAverageDuration($deployments),
            'last_deployment' => $deployments[0] ?? null,
        ];
    }

    /**
     * Calcule la durée moyenne des déploiements
     */
    private function calculateAverageDuration(array $deployments): string
    {
        if (empty($deployments)) {
            return '0s';
        }

        $totalSeconds = 0;
        $count = 0;

        foreach ($deployments as $deployment) {
            if (preg_match('/(\d+)s/', $deployment['duration'], $matches)) {
                $totalSeconds += $matches[1];
                $count++;
            }
        }

        if ($count === 0) {
            return '0s';
        }

        $avgSeconds = intval($totalSeconds / $count);

        if ($avgSeconds < 60) {
            return $avgSeconds . 's';
        }

        $minutes = intval($avgSeconds / 60);
        return $minutes . 'm';
    }
}
