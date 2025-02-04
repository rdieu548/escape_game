<?php
class AuthController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function login() {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->username) || !isset($data->password)) {
            echo json_encode(['error' => 'Missing credentials']);
            return;
        }

        $query = "SELECT id, username FROM users WHERE username = ? AND password_hash = ?";
        $stmt = $this->db->prepare($query);
        $password_hash = hash('sha256', $data->password);
        $stmt->execute([$data->username, $password_hash]);
        
        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode([
                "success" => true,
                "user" => $user
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Invalid credentials"
            ]);
        }
    }

    public function register() {
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "INSERT INTO users (username, password_hash) VALUES (?, ?)";
        $stmt = $this->db->prepare($query);
        $password_hash = hash('sha256', $data->password);
        
        try {
            $stmt->execute([$data->username, $password_hash]);
            echo json_encode([
                "success" => true,
                "message" => "User created successfully"
            ]);
        } catch (PDOException $e) {
            echo json_encode([
                "success" => false,
                "message" => "Username already exists"
            ]);
        }
    }
} 