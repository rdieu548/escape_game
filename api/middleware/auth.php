<?php
function checkAuth() {
    // Vérification du token JWT ou de la session
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
} 