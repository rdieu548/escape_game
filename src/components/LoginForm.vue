<template>
  <div class="login-form">
    <h2>🎮 Connexion</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <input 
          type="text" 
          v-model="username" 
          placeholder="Votre pseudo..."
          required
        >
      </div>
      <button type="submit" class="btn btn-primary">
        Commencer l'aventure
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const username = ref('');

const handleSubmit = () => {
  if (username.value.trim()) {
    authStore.login(username.value.trim());
    router.push('/scenarios');
  }
};
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(13, 13, 23, 0.95);
  border-radius: 15px;
  border: 1px solid rgba(66, 184, 131, 0.2);
}

.form-group {
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid rgba(66, 184, 131, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

button {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
}
</style> 