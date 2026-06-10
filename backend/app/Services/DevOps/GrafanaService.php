<?php

namespace App\Services\DevOps;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Exception;

/**
 * Service pour intégration avec Grafana
 * À utiliser pour récupérer les tableaux de bord et les métriques en temps réel
 */
class GrafanaService
{
    private $baseUrl;
    private $apiKey;

    public function __construct()
    {
        $this->baseUrl = Config::get('services.grafana.url');
        $this->apiKey = Config::get('services.grafana.api_key');
    }

    /**
     * Récupère les tableaux de bord disponibles
     */
    public function getDashboards(): array
    {
        if (!$this->baseUrl || !$this->apiKey) {
            return [];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->timeout(10)->get($this->baseUrl . '/api/search?type=dash-db');

            if ($response->successful()) {
                return $response->json();
            }

            return [];
        } catch (Exception $e) {
            return [];
        }
    }

    /**
     * Récupère un tableau de bord spécifique
     */
    public function getDashboard(string $uid): array
    {
        if (!$this->baseUrl || !$this->apiKey) {
            return [];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->timeout(10)->get($this->baseUrl . '/api/dashboards/uid/' . $uid);

            if ($response->successful()) {
                return $response->json();
            }

            return [];
        } catch (Exception $e) {
            return [];
        }
    }

    /**
     * Récupère les données de Prometheus pour une métrique
     */
    public function queryPrometheus(string $query): array
    {
        // À implémenter avec PrometheusService
        return [];
    }

    /**
     * Crée une alerte dans Grafana
     */
    public function createAlert(array $alertData): array
    {
        if (!$this->baseUrl || !$this->apiKey) {
            return ['success' => false, 'message' => 'Grafana not configured'];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->timeout(10)->post($this->baseUrl . '/api/v1/alerts', $alertData);

            if ($response->successful()) {
                return ['success' => true, 'data' => $response->json()];
            }

            return ['success' => false, 'message' => 'Failed to create alert'];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
