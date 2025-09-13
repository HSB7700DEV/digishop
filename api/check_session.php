<?php
require 'config.php';

// Check if the user's session variables were set during login
if (isset($_SESSION['user_id']) && isset($_SESSION['user_name'])) {
    // If they exist, the user is logged in
    echo json_encode([
        'success' => true,
        'loggedIn' => true,
        'user' => [
            'name' => $_SESSION['user_name']
        ]
    ]);
} else {
    // If not, the user is not logged in
    echo json_encode(['success' => true, 'loggedIn' => false]);
}
?>