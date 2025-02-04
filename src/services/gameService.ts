import type { GameState, Scenario } from '@/types/game';

interface GameStats {
  gamesPlayed: number;
  averageTime: number;
  puzzlesSolved: number;
  puzzlesFailed: number;
  bestScores: Record<string, number>; // Par scénario
}

export class GameService {
  private static readonly SAVE_KEY = 'escape_game_save';
  private static readonly STATS_KEY = 'escape_game_stats';

  static saveGame(state: GameState): void {
    localStorage.setItem(this.SAVE_KEY, JSON.stringify(state));
  }

  static loadGame(): GameState | null {
    const saved = localStorage.getItem(this.SAVE_KEY);
    return saved ? JSON.parse(saved) : null;
  }

  static updateStats(scenario: Scenario, timeSpent: number, solved: boolean): void {
    const stats = this.getStats();
    stats.gamesPlayed++;
    
    if (solved) {
      stats.puzzlesSolved++;
      stats.averageTime = (stats.averageTime * (stats.gamesPlayed - 1) + timeSpent) / stats.gamesPlayed;
    } else {
      stats.puzzlesFailed++;
    }

    localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
  }

  static getStats(): GameStats {
    const saved = localStorage.getItem(this.STATS_KEY);
    return saved ? JSON.parse(saved) : {
      gamesPlayed: 0,
      averageTime: 0,
      puzzlesSolved: 0,
      puzzlesFailed: 0,
      bestScores: {}
    };
  }
} 