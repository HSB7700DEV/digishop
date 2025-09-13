<?php
require 'config.php';

// Ensure user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'برای ثبت سفارش باید وارد شوید.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$cart_items = $data['items'];
$total_amount = $data['total'];
$user_id = $_SESSION['user_id'];

if (empty($cart_items) || empty($total_amount)) {
    echo json_encode(['success' => false, 'message' => 'سبد خرید خالی است یا اطلاعات سفارش ناقص است.']);
    exit;
}

// Use a transaction to ensure all queries succeed or none do
$pdo->beginTransaction();

try {
    // 1. Insert the main order record
    $stmt = $pdo->prepare("INSERT INTO orders (user_id, total_amount, order_date) VALUES (?, ?, NOW())");
    $stmt->execute([$user_id, $total_amount]);
    
    // Get the ID of the order we just created
    $order_id = $pdo->lastInsertId();

    // 2. Insert each item from the cart into the order_items table
    $stmt_items = $pdo->prepare("INSERT INTO order_items (order_id, product_name, quantity, price) VALUES (?, ?, ?, ?)");
    
    foreach ($cart_items as $item) {
        // Remove currency formatting for database storage
        $price = floatval(str_replace(',', '', $item['price']));
        $stmt_items->execute([$order_id, $item['name'], $item['quantity'], $price]);
    }
    
    // If everything was successful, commit the transaction
    $pdo->commit();
    
    echo json_encode(['success' => true, 'message' => 'سفارش با موفقیت ثبت شد!', 'orderId' => $order_id]);

} catch (PDOException $e) {
    // If any query fails, roll back the transaction
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => 'خطایی در ثبت سفارش رخ داد: ' . $e->getMessage()]);
}
?>
