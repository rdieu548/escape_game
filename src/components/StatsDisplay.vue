<template>
  <div class="stats-container">
    <h2 class="stats-title">Statistiques</h2>
    
    <div class="stats-grid">
      <!-- Parties jouées -->
      <div class="stat-card">
        <div class="stat-icon">🎮</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.gamesPlayed }}</div>
          <div class="stat-label">Parties jouées</div>
        </div>
      </div>

      <!-- Temps moyen -->
      <div class="stat-card">
        <div class="stat-icon">⏱️</div>
        <div class="stat-content">
          <div class="stat-value">{{ formatTime(stats.averageTime) }}</div>
          <div class="stat-label">Temps moyen</div>
        </div>
      </div>

      <!-- Énigmes réussies -->
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.solvedPuzzles }}</div>
          <div class="stat-label">Énigmes réussies</div>
        </div>
      </div>

      <!-- Énigmes échouées -->
      <div class="stat-card">
        <div class="stat-icon">❌</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.failedPuzzles }}</div>
          <div class="stat-label">Énigmes échouées</div>
        </div>
      </div>
    </div>

    <div class="performance-chart">
      <h3 class="chart-title">Évolution des performances</h3>
      <!-- Ici on mettra un graphique plus tard -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Données de test
const stats = ref({
  gamesPlayed: 0,
  averageTime: 0,
  solvedPuzzles: 0,
  failedPuzzles: 0
});

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};
</script>

<style scoped>
.stats-container {
  background: rgba(13, 13, 23, 0.95);
  border-radius: 15px;
  border: 1px solid rgba(66, 184, 131, 0.2);
  padding: 2.5rem;
  margin-top: 2rem;
}

.stats-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2.5rem;
  color: #42b883;
  text-shadow: 0 0 10px rgba(66, 184, 131, 0.3);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: rgba(26, 26, 46, 0.95);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid rgba(66, 184, 131, 0.2);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(66, 184, 131, 0.15);
  border-color: rgba(66, 184, 131, 0.5);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 600;
  color: #42b883;
}

.stat-label {
  font-size: 1.1rem;
  color: #e1e1e1;
  opacity: 0.9;
}

.performance-chart {
  background: rgba(26, 26, 46, 0.95);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(66, 184, 131, 0.2);
}

.chart-title {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #42b883;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stats-container {
    padding: 1.5rem;
  }

  .stats-title {
    font-size: 2rem;
  }
}
</style> 