<template>
  <div class="add-job">
    <h1>Add job</h1>
    <form @submit.prevent="onSubmit">
      <div class="field">
        <label for="name">Job name</label>
        <input id="name" v-model="form.name" type="text" required />
      </div>
      <div class="field">
        <label for="description">Description</label>
        <textarea id="description" v-model="form.description" rows="4"></textarea>
      </div>
      <div class="field">
        <label for="date">Date</label>
        <input id="date" v-model="form.date" type="date" required />
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
      <button type="submit" class="btn" :disabled="loading">Save</button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { jobsApi } from '../api/jobs'

const form = reactive({ name: '', description: '', date: '' })
const error = ref('')
const success = ref('')
const loading = ref(false)

function today() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}
form.date = today()

async function onSubmit() {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    await jobsApi.create({
      name: form.name,
      description: form.description,
      date: form.date,
    })
    success.value = 'Job saved.'
    form.name = ''
    form.description = ''
    form.date = today()
  } catch (e) {
    error.value = e.message || 'Failed to save job'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.add-job {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  max-width: 480px;
}
.add-job h1 {
  margin: 0 0 1.25rem;
  font-size: 1.35rem;
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
.field input,
.field textarea {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  box-sizing: border-box;
}
.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: #3b82f6;
}
.error {
  color: #dc2626;
  font-size: 0.9rem;
  margin: 0 0 0.75rem;
}
.success {
  color: #059669;
  font-size: 0.9rem;
  margin: 0 0 0.75rem;
}
.btn {
  padding: 0.65rem 1.25rem;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}
.btn:hover:not(:disabled) {
  background: #2563eb;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
