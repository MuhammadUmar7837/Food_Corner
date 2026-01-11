<?php
// db.php
// Configuration for database connection

$host = 'localhost'; // Usually 'localhost' for local development
$db   = 'food_delivery'; // The database name you created
$user = 'root';      // Your MySQL username (default for XAMPP/MAMP)
$pass = '';          // Your MySQL password (default is often empty for XAMPP/MAMP)
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Throw exceptions on errors
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Fetch rows as associative arrays
    PDO::ATTR_EMULATE_PREPARES   => false,                  // Disable emulation for better security/performance
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // If connection fails, send a 500 Internal Server Error response
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]);
    exit(); // Stop script execution
}
?>