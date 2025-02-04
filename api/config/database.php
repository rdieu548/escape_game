<?php
class Database {
    private $host = "localhost:8889"; // Port MAMP par défaut pour MySQL
    private $db_name = "escape_game";
    private $username = "root";
    private $password = "root"; // Mot de passe par défaut de MAMP
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            echo "Connection error: " . $e->getMessage();
        }
        return $this->conn;
    }
} 