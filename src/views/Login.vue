<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">🎯 Connexion</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Nom d'utilisateur</label>
          <input 
            id="username"
            v-model="username"
            type="text"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input 
            id="password"
            v-model="password"
            type="password"
            required
          />
        </div>
        <button type="submit" class="btn-login">Se connecter</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--bg-dark);
}

.login-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 2.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  border: 1px solid rgba(66, 184, 131, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.login-title {
  color: white;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: bold;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: white;
  font-size: 1.1rem;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid rgba(66, 184, 131, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(66, 184, 131, 0.2);
}

.btn-login {
  width: 100%;
  padding: 1rem;
  background: var(--primary);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-login:hover {
  background: #3aa876;
  transform: translateY(-2px);
}

/* ... autres styles ... */
</style> 