<?php
require 'config.php';

try {
    // Check if the request is for featured products (for the homepage)
    if (isset($_GET['featured']) && $_GET['featured'] == 'true') {
        $stmt = $pdo->prepare("SELECT * FROM products WHERE is_featured = 1");
    } else {
        // Otherwise, get all products
        $stmt = $pdo->prepare("SELECT * FROM products");
    }
    
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'products' => $products]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'خطا در دریافت اطلاعات محصولات: ' . $e->getMessage()]);
}
?>