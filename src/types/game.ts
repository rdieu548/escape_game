export interface Scenario {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // en secondes
  image?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  image: string;
  isUsable: boolean;
  canBeUsedMultipleTimes: boolean;
}

export interface Puzzle {
  id: number;
  scenarioId: string;
  orderIndex: number;
  title: string;
  description: string;
  type: 'code' | 'combination' | 'riddle' | 'item_use';
  solution: string;
  hints: string[];
  requirements?: {
    itemId?: string;
    puzzleId?: number;
  }[];
  reward: {
    item?: string;
    score: number;
  };
  unlocks?: number[];
}

export interface GameState {
  scenarioId: string;
  inventory: string[];
  solvedPuzzles: number[];
  timeRemaining: number;
  score: number;
  hintsUsed: number;
}

export interface User {
  id: string;
  username: string;
  highScores: Record<string, number>; // scenarioId -> score
  savedGames: GameState[];
} 