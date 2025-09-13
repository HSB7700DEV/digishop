<?php
require 'config.php';

// Ensure user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'برای مشاهده سفارشات باید وارد شوید.']);
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    $stmt = $pdo->prepare("SELECT id, total_amount, DATE_FORMAT(order_date, '%Y-%m-%d') as order_date FROM orders WHERE user_id = ? ORDER BY order_date DESC");
    $stmt->execute([$user_id]);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Here you could also fetch the items for each order if needed
    
    echo json_encode(['success' => true, 'orders' => $orders]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'خطا در دریافت اطلاعات سفارشات: ' . $e->getMessage()]);
}
?>
