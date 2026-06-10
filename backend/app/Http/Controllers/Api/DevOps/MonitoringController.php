<?php

namespace App\Http\Controllers\Api\DevOps;

use App\Services\DevOps\MonitoringService;
use Illuminate\Http\JsonResponse;

class MonitoringController extends Controller
{
    private $monitoringService;

    public function __construct(MonitoringService $monitoringService)
    {
        $this->monitoringService = $monitoringService;
    }

    /**
     * Retourne les métriques de monitoring
     */
    public function index(): JsonResponse
    {
        try {
            return response()->json([
                'status' => 'success',
                'data' => [
                    'metrics' => $this->monitoringService->getMetrics(),
                    'services' => $this->monitoringService->getServicesStatus(),
                    'alerts' => $this->monitoringService->getAlerts(),
                ],
                'timestamp' => now()->toIso8601String(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve monitoring data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
