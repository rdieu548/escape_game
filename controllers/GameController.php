<?php
class GameController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function saveGame() {
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "INSERT INTO games 
                  (user_id, scenario_id, current_puzzle_id, inventory, score, time_remaining, hints_used) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute([
            $data->userId,
            $data->scenarioId,
            $data->currentPuzzleId,
            json_encode($data->inventory),
            $data->score,
            $data->timeRemaining,
            $data->hintsUsed
        ]);

        echo json_encode(["message" => "Game saved", "id" => $this->db->lastInsertId()]);
    }

    public function loadGame($id) {
        $query = "SELECT * FROM games WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$id]);
        
        $game = $stmt->fetch(PDO::FETCH_ASSOC);
        $game['inventory'] = json_decode($game['inventory']);
        
        echo json_encode($game);
    }
} 