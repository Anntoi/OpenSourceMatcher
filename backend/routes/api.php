<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DemoController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\IssueController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\DevOps\DashboardController as DevOpsDashboardController;
use App\Http\Controllers\Api\DevOps\HealthController;
use App\Http\Controllers\Api\DevOps\PipelineController;
use App\Http\Controllers\Api\DevOps\DeploymentController;
use App\Http\Controllers\Api\DevOps\MonitoringController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/issues', [IssueController::class, 'index']);
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:6,1');
    Route::get('/demo', [DemoController::class, '__invoke']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::get('/favorites', [FavoriteController::class, 'index']);
        Route::post('/favorites', [FavoriteController::class, 'store']);
        Route::delete('/favorites/{issueNumber}', [FavoriteController::class, 'destroy']);

        Route::put('/profile', [ProfileController::class, 'update']);

        // DevOps Routes (Admin only)
        Route::middleware('admin')->prefix('devops')->group(function () {
            Route::get('/dashboard', [DevOpsDashboardController::class, 'index']);
            Route::get('/health', [HealthController::class, 'index']);
            Route::get('/pipelines', [PipelineController::class, 'index']);
            Route::get('/deployments', [DeploymentController::class, 'index']);
            Route::get('/monitoring', [MonitoringController::class, 'index']);
        });
    });
});