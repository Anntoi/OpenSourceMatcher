<?php

namespace App\Services\DevOps;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Exception;

/**
 * Service pour intégration avec Prometheus
 * À utiliser pour récupérer les métriques en temps réel
 */
class PrometheusService
{
    private $baseUrl;

    public function __construct()
    {
        $this->baseUrl = Config::get('services.prometheus.url');
    }

    /**
     * Exécute une requête PromQL
     */
    public function query(string $promql): array
    {
        if (!$this->baseUrl) {
            return [];
        }

        try {
            $response = Http::timeout(10)->get($this->baseUrl . '/api/v1/query', [
                'query' => $promql,
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            return [];
        } catch (Exception $e) {
            return [];
        }
    }

    /**
     * Récupère les séries temporelles pour une métrique
     */
    public function queryRange(string $promql, string $start, string $end, string $step = '1m'): array
    {
        if (!$this->baseUrl) {
            return [];
        }

        try {
            $response = Http::timeout(10)->get($this->baseUrl . '/api/v1/query_range', [
                'query' => $promql,
                'start' => $start,
                'end' => $end,
                'step' => $step,
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            return [];
        } catch (Exception $e) {
            return [];
        }
    }

    /**
     * Récupère les cibles Prometheus
     */
    public function getTargets(): array
    {
        if (!$this->baseUrl) {
            return [];
        }

        try {
            $response = Http::timeout(10)->get($this->baseUrl . '/api/v1/targets');

            if ($response->successful()) {
                return $response->json()['data'] ?? [];
            }

            return [];
        } catch (Exception $e) {
            return [];
        }
    }

    /**
     * Récupère les alertes actives depuis Prometheus
     */
    public function getAlerts(): array
    {
        if (!$this->baseUrl) {
            return [];
        }

        try {
            $response = Http::timeout(10)->get($this->baseUrl . '/api/v1/alerts');

            if ($response->successful()) {
                return $response->json()['data']['alerts'] ?? [];
            }

            return [];
        } catch (Exception $e) {
            return [];
        }
    }
}
