<template>
  <div class="register-page">
    <div class="register-card">
      <h1>Register</h1>
      <form @submit.prevent="onSubmit">
        <div class="field">
          <label for="username">Username</label>
          <input id="username" v-model="username" type="text" required autocomplete="username" />
        </div>
        <div class="field">
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password" required autocomplete="new-password" />
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <button type="submit" class="btn" :disabled="loading">Register</button>
      </form>
      <p class="link">
        <router-link to="/login">Back to Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { authApi } from '../api/auth'

const auth = useAuthStore()
const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    const data = await authApi.register(username.value, password.value)
    auth.setAuth(data.token, data.user)
    router.push('/add_job')
  } catch (e) {
    error.value = e.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
}
.register-card {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 360px;
}
.register-card h1 {
  margin: 0 0 1.5rem;
  font-size: 1.5rem;
  color: #1e293b;
}
.field {
  margin-bottom: 1rem;
}
.field label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.9rem;
  color: #475569;
}
.field input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}
.error {
  color: #dc2626;
  font-size: 0.9rem;
  margin: 0 0 0.75rem;
}
.btn {
  width: 100%;
  padding: 0.65rem 1rem;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.link {
  margin: 1rem 0 0;
  font-size: 0.9rem;
  text-align: center;
}
.link a {
  color: #3b82f6;
  text-decoration: none;
}
.link a:hover {
  text-decoration: underline;
}
</style>
