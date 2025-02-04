<template>
  <div class="scenarios-container">
    <h1 class="title">🎯 Choisissez votre aventure</h1>
    
    <div class="scenarios-grid">
      <!-- Scénario du Laboratoire -->
      <div class="scenario-card">
        <div class="scenario-image">
          <img src="https://cdn.discordapp.com/attachments/1006868006602801223/1335912602731286560/lab.jpg?ex=67a1e510&is=67a09390&hm=ff67dccf0af67b4c9a8b448f3c821aff2ba96f5901064a99d2a71234fca1d92e&" alt="Laboratoire">
          <div class="scenario-overlay">
            <span class="difficulty">🟡 Moyen</span>
            <div class="scenario-content">
              <h2>Évasion du Laboratoire</h2>
              <p>Échappez-vous d'un laboratoire secret avant que le virus ne se propage!</p>
              <button @click="startScenario('lab')" class="btn-start">
                Commencer l'aventure
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Scénario du Manoir -->
      <div class="scenario-card disabled">
        <div class="scenario-image">
          <img src="https://cdn.discordapp.com/attachments/1006868006602801223/1335912603158843463/mansion.jpg?ex=67a1e510&is=67a09390&hm=3606c8300f04acdb4eebe7f653f9a6b7a65b70fb8262a430979cbcd27e26d395&" alt="Manoir">
          <div class="scenario-overlay">
            <span class="difficulty">🔴 Difficile</span>
            <div class="scenario-content">
              <h2>Le Manoir Hanté</h2>
              <p>Explorez un manoir abandonné et découvrez ses secrets...</p>
              <div class="coming-soon">
                🚧 Disponible prochainement
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scenarios-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--bg-dark);
  min-height: 100vh;
}

.title {
  color: white;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.scenarios-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.scenario-card {
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
  height: 450px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(66, 184, 131, 0.2);
}

.scenario-card:hover {
  transform: translateY(-10px);
}

.scenario-image {
  position: relative;
  width: 100%;
  height: 100%;
}

.scenario-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scenario-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0.9)
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;
}

.difficulty {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
}

.scenario-content {
  color: white;
  text-align: center;
}

.scenario-content h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #42b883;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.scenario-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: white;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.9);
  line-height: 1.6;
}

.btn-start {
  width: 100%;
  padding: 1rem 2rem;
  background: #42b883;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 1px;
}

.btn-start:hover {
  background: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(66, 184, 131, 0.4);
}

.scenario-card.disabled {
  opacity: 0.7;
  cursor: not-allowed;
  position: relative;
}

.scenario-card.disabled:hover {
  transform: none;
}

.coming-soon {
  background: rgba(0, 0, 0, 0.8);
  color: #ffd700;
  padding: 1rem;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.1rem;
  border: 1px solid rgba(255, 215, 0, 0.3);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 1rem;
}

.scenario-card.disabled .btn-start {
  display: none;
}
</style>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const startScenario = (type: string) => {
  if (type === 'lab') {
    router.push('/game');
  }
};
</script> 