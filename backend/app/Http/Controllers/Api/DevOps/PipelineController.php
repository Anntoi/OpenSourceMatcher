<?php

namespace App\Http\Controllers\Api\DevOps;

use App\Services\DevOps\PipelineService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PipelineController extends Controller
{
    private $pipelineService;

    public function __construct(PipelineService $pipelineService)
    {
        $this->pipelineService = $pipelineService;
    }

    /**
     * Retourne la liste des pipelines GitHub Actions
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $limit = $request->query('limit', 20);
            
            return response()->json([
                'status' => 'success',
                'data' => $this->pipelineService->getPipelines($limit),
                'timestamp' => now()->toIso8601String(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve pipelines',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
