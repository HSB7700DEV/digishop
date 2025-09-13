<?php
require 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['email']) || empty($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'لطفاً ایمیل و رمز عبور را وارد کنید.']);
    exit;
}

$email = $data['email'];
$password = $data['password'];

// Find the user by email
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Verify user exists and password is correct
if ($user && password_verify($password, $user['password'])) {
    // Password is correct, store user info in session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_role'] = $user['role']; 

    echo json_encode([
        'success' => true,
        'user' => [
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role']
        ]
    ]);
} else {
    // Invalid credentials
    echo json_encode(['success' => false, 'message' => 'ایمیل یا رمز عبور نامعتبر است.']);
}
?>
