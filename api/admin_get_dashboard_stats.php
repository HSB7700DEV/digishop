<?php
require 'config.php';

// Security Check: Ensure the user is an admin
if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized access.']);
    exit;
}

try {
    // Query for total users
    $users_stmt = $pdo->query("SELECT COUNT(*) as total_users FROM users");
    $total_users = $users_stmt->fetch(PDO::FETCH_ASSOC)['total_users'];

    // Query for total orders
    $orders_stmt = $pdo->query("SELECT COUNT(*) as total_orders FROM orders");
    $total_orders = $orders_stmt->fetch(PDO::FETCH_ASSOC)['total_orders'];

    // Query for total revenue
    $revenue_stmt = $pdo->query("SELECT SUM(total_amount) as total_revenue FROM orders");
    $total_revenue = $revenue_stmt->fetch(PDO::FETCH_ASSOC)['total_revenue'] ?? 0;

    echo json_encode([
        'success' => true,
        'stats' => [
            'total_users' => $total_users,
            'total_orders' => $total_orders,
            'total_revenue' => $total_revenue
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database query failed: ' . $e->getMessage()]);
}
?>