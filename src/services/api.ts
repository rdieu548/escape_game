export class ApiService {
    private static BASE_URL = 'http://localhost:8888/escape-game-api';

    static async login(username: string, password: string) {
        const response = await fetch(`${this.BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        return response.json();
    }

    static async saveGame(gameData: any) {
        const response = await fetch(`${this.BASE_URL}/api/game/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameData)
        });
        return response.json();
    }

    // Autres méthodes d'API...
} 