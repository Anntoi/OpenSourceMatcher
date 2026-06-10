<?php

namespace App\Http\Controllers\Api\DevOps;

use App\Services\DevOps\HealthCheckService;
use App\Services\DevOps\PipelineService;
use App\Services\DevOps\DeploymentService;
use App\Services\DevOps\MonitoringService;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    private $healthService;
    private $monitoringService;
    private $pipelineService;
    private $deploymentService;

    public function __construct(
        HealthCheckService $healthService,
        MonitoringService $monitoringService,
        PipelineService $pipelineService,
        DeploymentService $deploymentService
    ) {
        $this->healthService = $healthService;
        $this->monitoringService = $monitoringService;
        $this->pipelineService = $pipelineService;
        $this->deploymentService = $deploymentService;
    }

    /**
     * Retourne les données du dashboard
     */
    public function index(): JsonResponse
    {
        try {
            return response()->json([
                'status' => 'success',
                'data' => [
                    'services' => $this->healthService->getHealthStatus(),
                    'metrics' => $this->monitoringService->getMetrics(),
                    'recent_pipelines' => $this->pipelineService->getPipelines(5),
                    'deployment_stats' => $this->deploymentService->getDeploymentStats(),
                    'services_overview' => $this->monitoringService->getServicesStatus(),
                    'alerts' => $this->monitoringService->getAlerts(),
                ],
                'timestamp' => now()->toIso8601String(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve dashboard data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
