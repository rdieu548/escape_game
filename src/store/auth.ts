import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '@/services/authService';
import type { User } from '@/types/game';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const isAuthenticated = computed(() => user.value !== null);

    // Initialise l'état avec l'utilisateur stocké
    const init = () => {
        user.value = authService.getCurrentUser();
    };

    const login = (username: string) => {
        user.value = authService.login(username);
    };

    const logout = () => {
        authService.logout();
        user.value = null;
    };

    const saveHighScore = (scenarioId: string, score: number) => {
        if (!user.value) return;

        const currentHighScore = user.value.highScores[scenarioId] || 0;
        if (score > currentHighScore) {
            user.value.highScores[scenarioId] = score;
            authService.saveUser(user.value);
        }
    };

    const saveGameState = (gameState: GameState) => {
        if (!user.value) return;

        // Trouve et met à jour la sauvegarde existante ou en crée une nouvelle
        const existingIndex = user.value.savedGames.findIndex(
            g => g.scenarioId === gameState.scenarioId
        );

        if (existingIndex !== -1) {
            user.value.savedGames[existingIndex] = gameState;
        } else {
            user.value.savedGames.push(gameState);
        }

        authService.saveUser(user.value);
    };

    return {
        user,
        isAuthenticated,
        init,
        login,
        logout,
        saveHighScore,
        saveGameState
    };
}); 