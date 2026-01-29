<template>
  <aside class="sidebar">
    <div class="logo">Job App</div>
    <nav class="nav">
      <router-link to="/add_job" class="nav-link" active-class="active">Add job</router-link>
      <router-link to="/manage_job" class="nav-link" active-class="active">Manage job</router-link>
    </nav>
    <div class="footer">
      <button type="button" class="logout-btn" @click="logout">Logout</button>
    </div>
  </aside>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push({ name: 'Login' })
}
</script>

<style scoped>
.sidebar {
  width: 220px;
  background: #1e293b;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
}
.logo {
  font-size: 1.25rem;
  font-weight: 700;
  padding: 0 1rem 1.5rem;
  border-bottom: 1px solid #334155;
  margin-bottom: 1rem;
}
.nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0 0.5rem;
}
.nav-link {
  padding: 0.6rem 1rem;
  color: #94a3b8;
  text-decoration: none;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
}
.nav-link:hover {
  background: #334155;
  color: #e2e8f0;
}
.nav-link.active {
  background: #3b82f6;
  color: #fff;
}
.footer {
  margin-top: auto;
  padding: 1rem;
  border-top: 1px solid #334155;
}
.logout-btn {
  width: 100%;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid #475569;
  color: #94a3b8;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}
.logout-btn:hover {
  background: #334155;
  color: #e2e8f0;
}
</style>
