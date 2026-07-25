<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "Testing Laravel simple...\n";

try {
    require __DIR__ . '/vendor/autoload.php';
    echo "✓ Autoload loaded\n";
} catch (Exception $e) {
    echo "✗ Autoload failed: " . $e->getMessage() . "\n";
    exit(1);
}

try {
    // Load environment
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();
    echo "✓ Environment loaded\n";
} catch (Exception $e) {
    echo "✗ Environment failed: " . $e->getMessage() . "\n";
    exit(1);
}

try {
    // Check APP_KEY
    $appKey = env('APP_KEY');
    if (!$appKey) {
        echo "✗ APP_KEY is not set\n";
        exit(1);
    }
    echo "✓ APP_KEY is set\n";
} catch (Exception $e) {
    echo "✗ APP_KEY check failed: " . $e->getMessage() . "\n";
    exit(1);
}

try {
    $app = require __DIR__ . '/bootstrap/app.php';
    echo "✓ App loaded\n";
} catch (Exception $e) {
    echo "✗ App failed: " . $e->getMessage() . "\n";
    exit(1);
}

echo "\n✓ Simple test successful!\n";
