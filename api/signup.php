<?php
require 'config.php';

// Get the posted data.
$data = json_decode(file_get_contents('php://input'), true);

// Basic validation
if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'لطفاً تمام فیلدها را پر کنید.']);
    exit;
}

$name = $data['name'];
$email = $data['email'];
$password = $data['password'];

// Hash the password for security
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Check if the user already exists
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);

if ($stmt->rowCount() > 0) {
    echo json_encode(['success' => false, 'message' => 'این ایمیل قبلاً ثبت شده است.']);
    exit;
}

// Insert the new user into the database
try {
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, signup_date) VALUES (?, ?, ?, NOW())");
    $stmt->execute([$name, $email, $hashed_password]);
    
    echo json_encode(['success' => true, 'message' => 'ثبت‌نام با موفقیت انجام شد.']);
    
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'خطایی در ثبت‌نام رخ داد: ' . $e->getMessage()]);
}
?>
