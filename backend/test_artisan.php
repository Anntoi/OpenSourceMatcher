<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "Testing Artisan...\n";

try {
    require __DIR__ . '/vendor/autoload.php';
    echo "✓ Autoload loaded\n";
} catch (Exception $e) {
    echo "✗ Autoload failed: " . $e->getMessage() . "\n";
    exit(1);
}

try {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();
    echo "✓ Environment loaded\n";
} catch (Exception $e) {
    echo "✗ Environment failed: " . $e->getMessage() . "\n";
    exit(1);
}

try {
    $app = require __DIR__ . '/bootstrap/app.php';
    echo "✓ App loaded\n";
} catch (Exception $e) {
    echo "✗ App failed: " . $e->getMessage() . "\n";
    exit(1);
}

try {
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    echo "✓ Kernel created\n";
} catch (Exception $e) {
    echo "✗ Kernel failed: " . $e->getMessage() . "\n";
    exit(1);
}

try {
    $kernel->bootstrap();
    echo "✓ Kernel bootstrapped\n";
} catch (Exception $e) {
    echo "✗ Bootstrap failed: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
    exit(1);
}

try {
    // Test migration
    $migrator = $app->make('migrator');
    echo "✓ Migrator created\n";
} catch (Exception $e) {
    echo "✗ Migrator failed: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
    exit(1);
}

echo "\n✓ Artisan test successful!\n";
