import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import Home from '@/views/Home.vue';
import ScenarioSelector from '../components/ScenarioSelector.vue';
import PuzzleGame from '../components/PuzzleGame.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/scenarios',
    name: 'scenarios',
    component: ScenarioSelector,
    meta: { requiresAuth: true }
  },
  {
    path: '/game',
    name: 'game',
    component: PuzzleGame,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Garde de navigation
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Initialise l'état de l'authentification
  if (!authStore.isAuthenticated) {
    authStore.init();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirige vers la page d'accueil si non authentifié
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router; 