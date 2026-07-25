<?php

echo "=== Diagnostic PHP/Laravel ===\n\n";

// Test PHP version
echo "PHP Version: " . PHP_VERSION . "\n\n";

// Test extensions requises
$required_extensions = ['pdo', 'pdo_pgsql', 'mbstring', 'json', 'openssl', 'tokenizer', 'xml'];
echo "Required Extensions:\n";
foreach ($required_extensions as $ext) {
    $status = extension_loaded($ext) ? '✓' : '✗';
    echo "  $status $ext\n";
}
echo "\n";

// Test fichier .env
echo ".env file: " . (file_exists(__DIR__ . '/.env') ? 'EXISTS' : 'NOT FOUND') . "\n";
echo "vendor directory: " . (is_dir(__DIR__ . '/vendor') ? 'EXISTS' : 'NOT FOUND') . "\n";
echo "storage directory: " . (is_dir(__DIR__ . '/storage') ? 'EXISTS' : 'NOT FOUND') . "\n\n";

// Test permissions
echo "Directory Permissions:\n";
$dirs = ['storage', 'storage/logs', 'storage/framework', 'bootstrap/cache'];
foreach ($dirs as $dir) {
    $path = __DIR__ . '/' . $dir;
    if (is_dir($path)) {
        $perms = substr(sprintf('%o', fileperms($path)), -4);
        $writable = is_writable($path) ? 'WRITABLE' : 'NOT WRITABLE';
        echo "  $path: $perms ($writable)\n";
    } else {
        echo "  $path: NOT FOUND\n";
    }
}
echo "\n";

// Test composer.json
echo "composer.json: " . (file_exists(__DIR__ . '/composer.json') ? 'EXISTS' : 'NOT FOUND') . "\n";

// Test si composer a installé les dépendances
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    echo "vendor/autoload.php: EXISTS\n";
    try {
        require __DIR__ . '/vendor/autoload.php';
        echo "Autoload: SUCCESS\n";
    } catch (Exception $e) {
        echo "Autoload: FAILED - " . $e->getMessage() . "\n";
    }
} else {
    echo "vendor/autoload.php: NOT FOUND - Run 'composer install'\n";
}
echo "\n";

// Test variables d'environnement
echo "Environment Variables:\n";
$env_file = __DIR__ . '/.env';
if (file_exists($env_file)) {
    $env_content = file_get_contents($env_file);
    $lines = explode("\n", $env_content);
    foreach ($lines as $line) {
        if (strpos($line, 'APP_') === 0) {
            echo "  " . substr($line, 0, 50) . "\n";
        }
    }
} else {
    echo "  .env file not found\n";
}
echo "\n";

echo "=== Diagnostic Complete ===\n";
