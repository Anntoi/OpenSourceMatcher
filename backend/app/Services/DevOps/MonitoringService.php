<?php

namespace App\Services\DevOps;

use Exception;

class MonitoringService
{
    /**
     * Récupère les métriques de monitoring
     * Note: Les métriques réelles viendront de Prometheus/Grafana
     */
    public function getMetrics(): array
    {
        return [
            'cpu' => $this->getCpuMetrics(),
            'memory' => $this->getMemoryMetrics(),
            'disk' => $this->getDiskMetrics(),
            'response_time' => $this->getResponseTimeMetrics(),
        ];
    }

    /**
     * Récupère les métriques CPU (simulées)
     */
    private function getCpuMetrics(): array
    {
        return [
            'name' => 'CPU Usage',
            'unit' => '%',
            'current' => rand(15, 45),
            'average' => 30,
            'max' => 80,
            'threshold' => 80,
            'history' => $this->generateHistoryData(24),
            'status' => 'healthy',
        ];
    }

    /**
     * Récupère les métriques mémoire (simulées)
     */
    private function getMemoryMetrics(): array
    {
        return [
            'name' => 'Memory Usage',
            'unit' => 'GB',
            'current' => round(rand(4, 8), 2),
            'total' => 16,
            'percentage' => rand(20, 50),
            'threshold' => 80,
            'history' => $this->generateHistoryData(24),
            'status' => 'healthy',
        ];
    }

    /**
     * Récupère les métriques disque (simulées)
     */
    private function getDiskMetrics(): array
    {
        return [
            'name' => 'Disk Usage',
            'unit' => 'GB',
            'current' => rand(200, 400),
            'total' => 500,
            'percentage' => rand(40, 80),
            'threshold' => 90,
            'history' => $this->generateHistoryData(24),
            'status' => 'healthy',
        ];
    }

    /**
     * Récupère les métriques de temps de réponse (simulées)
     */
    private function getResponseTimeMetrics(): array
    {
        return [
            'name' => 'API Response Time',
            'unit' => 'ms',
            'current' => rand(50, 150),
            'average' => 100,
            'p95' => 250,
            'p99' => 500,
            'threshold' => 1000,
            'history' => $this->generateHistoryData(24),
            'status' => 'healthy',
        ];
    }

    /**
     * Génère des données historiques pour les graphiques
     */
    private function generateHistoryData(int $hours): array
    {
        $data = [];
        $now = now();

        for ($i = $hours; $i >= 0; $i--) {
            $data[] = [
                'timestamp' => $now->copy()->subHours($i)->toIso8601String(),
                'value' => rand(20, 70),
            ];
        }

        return $data;
    }

    /**
     * Récupère les données des services
     */
    public function getServicesStatus(): array
    {
        return [
            [
                'name' => 'Backend API',
                'status' => 'online',
                'uptime' => '45 days 12 hours',
                'last_update' => now()->subMinutes(2)->toIso8601String(),
            ],
            [
                'name' => 'Frontend',
                'status' => 'online',
                'uptime' => '30 days 5 hours',
                'last_update' => now()->subMinutes(1)->toIso8601String(),
            ],
            [
                'name' => 'PostgreSQL',
                'status' => 'online',
                'uptime' => '60 days 1 hour',
                'last_update' => now()->toIso8601String(),
            ],
            [
                'name' => 'Redis Cache',
                'status' => 'online',
                'uptime' => '15 days 8 hours',
                'last_update' => now()->subSeconds(30)->toIso8601String(),
            ],
        ];
    }

    /**
     * Récupère les alertes actives
     */
    public function getAlerts(): array
    {
        return [
            [
                'id' => 1,
                'title' => 'High Memory Usage',
                'severity' => 'warning',
                'message' => 'Memory usage is at 72%',
                'timestamp' => now()->subHours(1)->toIso8601String(),
                'resolved' => false,
            ],
            [
                'id' => 2,
                'title' => 'Slow API Response',
                'severity' => 'info',
                'message' => 'Average response time is 250ms',
                'timestamp' => now()->subHours(2)->toIso8601String(),
                'resolved' => false,
            ],
        ];
    }
}
