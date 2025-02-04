<template>
  <div class="auth-form">
    <h2>{{ isLogin ? 'Connexion' : 'Inscription' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <input v-model="username" type="text" class="form-control" placeholder="Nom d'utilisateur">
      </div>
      <div class="mb-3">
        <input v-model="password" type="password" class="form-control" placeholder="Mot de passe">
      </div>
      <button type="submit" class="btn btn-primary">{{ isLogin ? 'Se connecter' : "S'inscrire" }}</button>
    </form>
  </div>
</template>

<script setup lang="ts">
// ... logique d'authentification
</script> 