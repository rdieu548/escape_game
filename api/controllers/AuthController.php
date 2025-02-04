<?php
class AuthController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function login() {
        $data = json_decode(file_get_contents("php://input"));
        
        // Simple exemple de login
        $query = "SELECT id, username FROM users WHERE username = ? AND password_hash = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$data->username, hash('sha256', $data->password)]);
        
        if($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode([
                "success" => true,
                "user" => $user
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Login failed"
            ]);
        }
    }
} 