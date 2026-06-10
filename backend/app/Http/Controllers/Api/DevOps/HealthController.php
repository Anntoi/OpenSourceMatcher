<?php

namespace App\Http\Controllers\Api\DevOps;

use App\Services\DevOps\HealthCheckService;
use Illuminate\Http\JsonResponse;

class HealthController extends Controller
{
    private $healthService;

    public function __construct(HealthCheckService $healthService)
    {
        $this->healthService = $healthService;
    }

    /**
     * Retourne l'état de santé de tous les services
     */
    public function index(): JsonResponse
    {
        try {
            return response()->json([
                'status' => 'success',
                'data' => $this->healthService->getGlobalStatus(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve health status',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
