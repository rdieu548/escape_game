<template>
  <div class="scenarios">
    <h1>🎯 Choisissez votre aventure</h1>

    <div class="scenarios-grid">
      <div 
        v-for="scenario in scenarios" 
        :key="scenario.id"
        class="scenario-card"
        @click="selectScenario(scenario)"
      >
        <div class="scenario-image" :style="{ backgroundImage: `url(${scenario.image})` }">
          <div class="scenario-difficulty" :class="scenario.difficulty">
            {{ formatDifficulty(scenario.difficulty) }}
          </div>
        </div>

        <div class="scenario-content">
          <h2>{{ scenario.name }}</h2>
          <p>{{ scenario.description }}</p>
          
          <div class="scenario-info">
            <span class="time-limit">
              ⏱️ {{ formatTime(scenario.timeLimit) }}
            </span>
            <span class="high-score" v-if="getHighScore(scenario.id)">
              🏆 {{ getHighScore(scenario.id) }}
            </span>
          </div>

          <button class="btn btn-primary start-btn">
            Commencer l'aventure
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { useGameStore } from '@/store/game';
import { getScenarios } from '@/data/scenarios';
import type { Scenario } from '@/types/game';

const router = useRouter();
const authStore = useAuthStore();
const gameStore = useGameStore();

const scenarios = computed(() => getScenarios());

const formatDifficulty = (difficulty: string) => {
  const difficulties = {
    easy: '🟢 Facile',
    medium: '🟡 Moyen',
    hard: '🔴 Difficile'
  };
  return difficulties[difficulty as keyof typeof difficulties] || difficulty;
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} minutes`;
};

const getHighScore = (scenarioId: string) => {
  return authStore.user?.highScores[scenarioId] || null;
};

const selectScenario = (scenario: Scenario) => {
  gameStore.startGame(scenario);
  router.push('/game');
};
</script>

<style scoped>
.scenarios {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 3rem;
}

.scenarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.scenario-card {
  background: rgba(13, 13, 23, 0.95);
  border-radius: 15px;
  border: 1px solid rgba(66, 184, 131, 0.2);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.scenario-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.scenario-image {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.scenario-difficulty {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  background: rgba(0, 0, 0, 0.8);
}

.scenario-difficulty.easy { color: #42b883; }
.scenario-difficulty.medium { color: #ffd700; }
.scenario-difficulty.hard { color: #ff6b6b; }

.scenario-content {
  padding: 1.5rem;
}

.scenario-content h2 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.scenario-content p {
  margin: 0 0 1.5rem 0;
  opacity: 0.8;
  line-height: 1.6;
}

.scenario-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  opacity: 0.8;
}

.start-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .scenarios-grid {
    grid-template-columns: 1fr;
  }
}
</style> 