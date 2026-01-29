<template>
  <div class="app-layout">
    <Sidebar />
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}
.main {
  flex: 1;
  padding: 1.5rem;
  background: #f5f5f5;
}
</style>
