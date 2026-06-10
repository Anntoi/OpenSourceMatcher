<?php

namespace App\Http\Controllers\Api\DevOps;

use App\Services\DevOps\DeploymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeploymentController extends Controller
{
    private $deploymentService;

    public function __construct(DeploymentService $deploymentService)
    {
        $this->deploymentService = $deploymentService;
    }

    /**
     * Retourne l'historique des déploiements
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $limit = $request->query('limit', 20);
            
            return response()->json([
                'status' => 'success',
                'data' => $this->deploymentService->getDeployments($limit),
                'stats' => $this->deploymentService->getDeploymentStats(),
                'timestamp' => now()->toIso8601String(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve deployments',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
