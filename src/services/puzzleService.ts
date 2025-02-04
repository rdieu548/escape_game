export class PuzzleService {
    static async getPuzzles(scenarioId: string) {
        const response = await fetch(`/api/game/puzzles?scenario_id=${scenarioId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    static async checkSolution(puzzleId: number, solution: string) {
        const response = await fetch(`/api/game/check-solution`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ puzzleId, solution })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
} 