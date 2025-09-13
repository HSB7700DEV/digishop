<?php
// Set headers to return JSON content
header('Content-Type: application/json');

// --- Database Configuration ---
$db_host = 'localhost';     // Your database host (e.g., 'localhost' or an IP)
$db_name = 'digishop_db';   // The name of your database
$db_user = 'root';          // Your database username
$db_pass = '';              // Your database password

// --- Establish Database Connection ---
try {
    // Create a new PDO instance
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    
    // Set the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
} catch(PDOException $e) {
    // If connection fails, stop the script and show an error.
    // In a production environment, you would log this error instead of displaying it.
    die(json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]));
}

// --- Start a Session ---
// Sessions are used to keep users logged in across different pages.
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
?>
