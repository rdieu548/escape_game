import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './auth';
import type { Scenario, GameState } from '@/types/game';
import { getPuzzles, checkSolution, getAvailablePuzzles } from '@/data/puzzles';

export const useGameStore = defineStore('game', () => {
  const authStore = useAuthStore();
  
  // État du jeu
  const currentScenario = ref<Scenario | null>(null);
  const currentPuzzleIndex = ref(0);
  const inventory = ref<string[]>([]);
  const timeRemaining = ref(0);
  const score = ref(1000);
  const hintsUsed = ref(0);
  const isPlaying = ref(false);
  const solvedPuzzles = ref<number[]>([]);

  // Getters
  const currentPuzzle = computed(() => {
    if (!currentScenario.value) return null;
    const availablePuzzles = getAvailablePuzzles(
      currentScenario.value.id,
      solvedPuzzles.value,
      inventory.value
    );
    return availablePuzzles[currentPuzzleIndex.value] || null;
  });

  // Actions
  const startGame = (scenario: Scenario) => {
    currentScenario.value = scenario;
    currentPuzzleIndex.value = 0;
    inventory.value = [];
    timeRemaining.value = scenario.timeLimit;
    score.value = 1000;
    hintsUsed.value = 0;
    solvedPuzzles.value = [];
    isPlaying.value = true;
    saveGameState();
  };

  const useHint = () => {
    if (!currentPuzzle.value) return;
    score.value -= 100;
    hintsUsed.value++;
    saveGameState();
  };

  const submitSolution = (answer: string): boolean => {
    if (!currentPuzzle.value || !currentScenario.value) return false;

    const isCorrect = checkSolution(
      currentPuzzle.value.id,
      answer,
      inventory.value
    );

    if (isCorrect) {
      // Ajoute la récompense à l'inventaire
      if (currentPuzzle.value.reward.item) {
        inventory.value.push(currentPuzzle.value.reward.item);
      }
      
      // Ajoute le score
      score.value += currentPuzzle.value.reward.score;
      
      // Marque le puzzle comme résolu
      solvedPuzzles.value.push(currentPuzzle.value.id);
      
      // Passe au puzzle suivant
      currentPuzzleIndex.value++;
      
      // Vérifie si le jeu est terminé
      const availablePuzzles = getAvailablePuzzles(
        currentScenario.value.id,
        solvedPuzzles.value,
        inventory.value
      );
      
      if (currentPuzzleIndex.value >= availablePuzzles.length) {
        endGame('complete');
      }
    } else {
      score.value -= 50; // Pénalité
    }

    saveGameState();
    return isCorrect;
  };

  const endGame = (reason: 'timeout' | 'complete') => {
    isPlaying.value = false;
    if (currentScenario.value) {
      authStore.saveHighScore(currentScenario.value.id, score.value);
    }
  };

  const saveGameState = () => {
    if (!currentScenario.value) return;
    
    const gameState: GameState = {
      scenarioId: currentScenario.value.id,
      inventory: inventory.value,
      solvedPuzzles: solvedPuzzles.value,
      timeRemaining: timeRemaining.value,
      score: score.value,
      hintsUsed: hintsUsed.value
    };

    authStore.saveGameState(gameState);
  };

  return {
    // État
    currentScenario,
    currentPuzzle,
    inventory,
    timeRemaining,
    score,
    hintsUsed,
    isPlaying,
    // Actions
    startGame,
    useHint,
    submitSolution,
    endGame
  };
}); 