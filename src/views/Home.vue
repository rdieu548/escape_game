<template>
  <div class="home">
    <div class="hero">
      <img src="@/assets/target.svg" alt="Logo" class="logo">
      <h1>Escape Game</h1>
    </div>

    <div v-if="!authStore.isAuthenticated" class="login-container">
      <div class="login-card">
        <div class="login-header">
          <span class="icon">🎮</span>
          <h2>Connexion</h2>
        </div>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <input 
              type="text" 
              v-model="username"
              placeholder="Votre pseudo..."
              required
            >
          </div>
          <button type="submit" class="btn-primary">
            Commencer l'aventure
          </button>
        </form>
      </div>
    </div>

    <div class="features">
      <div class="feature-card">
        <div class="feature-icon">🏰</div>
        <h3>Scénarios immersifs</h3>
        <p>Explorez des lieux mystérieux...</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🧩</div>
        <h3>Énigmes variées</h3>
        <p>Résolvez des puzzles uniques...</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🏆</div>
        <h3>Classements</h3>
        <p>Comparez vos scores...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import gsap from 'gsap';

const router = useRouter();
const authStore = useAuthStore();
const username = ref('');

const handleLogin = () => {
  if (username.value.trim()) {
    // Animation des cartes
    gsap.to('.feature-card', {
      scale: 0.95,
      duration: 0.2,
      stagger: 0.1,
      ease: 'power2.out'
    });

    gsap.to('.feature-card', {
      scale: 1,
      duration: 0.3,
      stagger: 0.1,
      delay: 0.2,
      ease: 'power2.out',
      onComplete: () => {
        authStore.login(username.value.trim());
        router.push('/scenarios');
      }
    });
  }
};
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: radial-gradient(circle at center, var(--bg-darker) 0%, var(--bg-dark) 100%);
}

.hero {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 120px;
  height: 120px;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 20px rgba(66, 184, 131, 0.3));
}

.hero h1 {
  font-size: 3.5rem;
  background: linear-gradient(45deg, #42b883, #64d8a4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(66, 184, 131, 0.3);
}

.login-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto 3rem;
}

.login-card {
  background: rgba(13, 13, 23, 0.95);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(66, 184, 131, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header .icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: block;
}

.login-header h2 {
  color: white;
  font-size: 2rem;
  margin: 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

input {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(66, 184, 131, 0.2);
  border-radius: 8px;
  color: white;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 10px rgba(66, 184, 131, 0.2);
}

.btn-primary {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  background: #42b883;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #3aa876;
  transform: translateY(-2px);
}

.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
  margin-top: 2rem;
}

.feature-card {
  background: rgba(13, 13, 23, 0.95);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(66, 184, 131, 0.2);
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  border-color: #42b883;
  box-shadow: 0 8px 32px rgba(66, 184, 131, 0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #42b883;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
}

.feature-card p {
  color: white;
  line-height: 1.6;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .features {
    grid-template-columns: 1fr;
  }
  
  .hero h1 {
    font-size: 2.5rem;
  }
}
</style> 