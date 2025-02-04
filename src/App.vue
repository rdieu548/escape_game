<template>
  <div class="app">
    <!-- Navbar conditionnelle -->
    <nav class="navbar" v-if="authStore.isAuthenticated">
      <router-link to="/" class="logo">
        🎯 Escape Game
      </router-link>
      <div class="nav-right">
        <router-link to="/scenarios">🎮 Scénarios</router-link>
        <button class="btn-logout" @click="handleLogout">
          <span>👋</span> Déconnexion
        </button>
      </div>
    </nav>

    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {
  await authStore.logout(); // Appelle la méthode logout du store
  router.push('/'); // Redirige vers la page d'accueil
};
</script>

<style>
:root {
  --primary: #42b883;
  --bg-dark: #13131f;
  --text: #ffffff;
}

body {
  margin: 0;
  background: var(--bg-dark);
  color: var(--text);
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-dark);
}

.navbar {
  background: rgba(13, 13, 23, 0.95);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(66, 184, 131, 0.2);
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: var(--primary);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-right a {
  text-decoration: none;
  color: var(--text);
  opacity: 0.8;
  transition: opacity 0.3s;
}

.nav-right a:hover {
  opacity: 1;
}

.nav-right a.router-link-active {
  color: var(--primary);
  opacity: 1;
}

main {
  flex: 1;
  position: relative;
}

/* Styles globaux pour les boutons */
.btn {
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--primary);
  color: var(--bg-dark);
}

.btn-primary:hover {
  background: #3aa876;
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--primary);
  color: var(--primary);
}

.btn-outline:hover {
  background: rgba(66, 184, 131, 0.1);
}

/* Styles pour les formulaires */
input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(66, 184, 131, 0.2);
  color: var(--text);
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

input:focus {
  outline: none;
  border-color: var(--primary);
}

/* Animations de transition */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.5rem;
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid #dc3545;
  color: #dc3545;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  background: rgba(220, 53, 69, 0.2);
  transform: translateY(-2px);
}

.btn-logout span {
  font-size: 1.1rem;
}
</style> 