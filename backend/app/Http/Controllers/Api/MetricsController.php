<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class MetricsController extends Controller
{
    /**
     * Expose les métriques au format Prometheus
     */
    public function index(): JsonResponse
    {
        $metrics = [];

        // Métriques HTTP de base
        $metrics[] = $this->createGauge(
            'http_requests_total',
            'Nombre total de requêtes HTTP traitées',
            $this->getTotalRequests(),
            ['method' => 'GET']
        );

        // Métriques de base de données
        $metrics[] = $this->createGauge(
            'database_connections_active',
            'Nombre de connexions actives à la base de données',
            $this->getDatabaseConnections()
        );

        // Métriques de cache
        $metrics[] = $this->createGauge(
            'cache_hit_rate',
            'Taux de succès du cache',
            $this->getCacheHitRate()
        );

        // Métriques d'authentification
        $metrics[] = $this->createGauge(
            'active_users',
            'Nombre d\'utilisateurs actifs',
            $this->getActiveUsers()
        );

        // Métriques d'issues
        $metrics[] = $this->createGauge(
            'total_favorites',
            'Nombre total de favoris',
            $this->getTotalFavorites()
        );

        $metrics[] = $this->createGauge(
            'total_issue_views',
            'Nombre total de vues d\'issues',
            $this->getTotalIssueViews()
        );

        // Métriques système simulées (pour démonstration)
        $metrics[] = $this->createGauge(
            'process_memory_usage_bytes',
            'Utilisation de la mémoire du processus',
            memory_get_usage(true),
            ['process' => 'php-fpm']
        );

        $metrics[] = $this->createGauge(
            'process_cpu_usage',
            'Utilisation CPU du processus',
            sys_getloadavg()[0] ?? 0,
            ['process' => 'php-fpm']
        );

        return response()->json([
            'metrics' => $metrics,
            'format' => 'prometheus',
        ]);
    }

    /**
     * Formate une métrique au format Prometheus
     */
    private function createGauge(string $name, string $help, float $value, array $labels = []): string
    {
        $labelString = '';
        if (!empty($labels)) {
            $labelPairs = [];
            foreach ($labels as $key => $val) {
                $labelPairs[] = sprintf('%s="%s"', $key, $val);
            }
            $labelString = sprintf('{%s}', implode(',', $labelPairs));
        }

        return sprintf(
            "# HELP %s %s\n# TYPE %s gauge\n%s%s %f",
            $name,
            $help,
            $name,
            $name,
            $labelString,
            $value
        );
    }

    /**
     * Récupère le nombre total de requêtes (simulé)
     */
    private function getTotalRequests(): int
    {
        return Cache::get('http_requests_total', 0);
    }

    /**
     * Récupère le nombre de connexions DB actives
     */
    private function getDatabaseConnections(): int
    {
        try {
            return DB::select('SELECT count(*) as connections FROM pg_stat_activity')[0]->connections ?? 0;
        } catch (\Exception $e) {
            return 0;
        }
    }

    /**
     * Calcule le taux de succès du cache
     */
    private function getCacheHitRate(): float
    {
        $hits = Cache::get('cache_hits', 0);
        $misses = Cache::get('cache_misses', 0);
        $total = $hits + $misses;

        return $total > 0 ? ($hits / $total) * 100 : 0;
    }

    /**
     * Récupère le nombre d'utilisateurs actifs
     */
    private function getActiveUsers(): int
    {
        return Cache::get('active_users', 0);
    }

    /**
     * Récupère le nombre total de favoris
     */
    private function getTotalFavorites(): int
    {
        try {
            return DB::table('favorites')->count();
        } catch (\Exception $e) {
            return 0;
        }
    }

    /**
     * Récupère le nombre total de vues d'issues
     */
    private function getTotalIssueViews(): int
    {
        try {
            return DB::table('issue_views')->count();
        } catch (\Exception $e) {
            return 0;
        }
    }
}