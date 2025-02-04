<?php
header('Content-Type: application/json');

require_once 'config/database.php';
require_once 'controllers/AuthController.php';
require_once 'controllers/GameController.php';
require_once 'controllers/StatsController.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Router
switch ($uri) {
    case '/api/auth/login':
        (new AuthController())->login();
        break;
    case '/api/game/save':
        (new GameController())->saveGame();
        break;
    case '/api/stats':
        (new StatsController())->getStats();
        break;
    // Autres routes...
} 