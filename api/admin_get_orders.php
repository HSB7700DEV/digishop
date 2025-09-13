<?php
require 'config.php';

// Security Check: Ensure the user is logged in and is an admin.
if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    // Set a 403 Forbidden status code and stop the script.
    http_response_code(403); 
    echo json_encode(['success' => false, 'message' => 'Unauthorized access.']);
    exit;
}

try {
    // SQL query to get all orders and join with the users table to get customer names.
    $stmt = $pdo->prepare("
        SELECT 
            o.id, 
            o.total_amount, 
            DATE_FORMAT(o.order_date, '%Y-%m-%d %H:%i') as order_date, 
            u.name as customer_name
        FROM 
            orders AS o
        JOIN 
            users AS u ON o.user_id = u.id
        ORDER BY 
            o.order_date DESC
    ");
    
    $stmt->execute();
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'orders' => $orders]);

} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'message' => 'Database query failed: ' . $e->getMessage()]);
}
?>