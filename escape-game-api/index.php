<?php
// Ajoutez ces lignes au début pour le debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Pour le développement
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Ajoutez cette ligne pour tester
echo json_encode(['status' => 'API is working']);
exit;

require_once 'config/database.php';
require_once 'controllers/AuthController.php';
require_once 'controllers/GameController.php';

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
    case '/api/game/load':
        $id = $_GET['id'] ?? null;
        if ($id) {
            (new GameController())->loadGame($id);
        }
        break;
    default:
        echo json_encode(['error' => 'Route not found']);
        break;
} 