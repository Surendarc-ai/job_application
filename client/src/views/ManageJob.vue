<template>
  <div class="manage-job">
    <h1>Manage job</h1>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <div v-else-if="jobs.length === 0" class="empty">No jobs yet. Add one from the sidebar.</div>
    <div v-else class="table-wrap">
      <table class="jobs-table">
        <thead>
          <tr>
            <th>Job name</th>
            <th>Description</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="job in jobs" :key="job._id">
            <td>{{ job.name }}</td>
            <td>{{ job.description || '—' }}</td>
            <td>{{ formatDate(job.date) }}</td>
            <td>
              <button type="button" class="btn-delete" @click="remove(job._id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { jobsApi } from '../api/jobs'

const jobs = ref([])
const loading = ref(true)
const error = ref('')

function formatDate(d) {
  if (!d) return '—'
  const date = new Date(d)
  return date.toLocaleDateString()
}

async function fetchJobs() {
  loading.value = true
  error.value = ''
  try {
    jobs.value = await jobsApi.list()
  } catch (e) {
    error.value = e.message || 'Failed to load jobs'
  } finally {
    loading.value = false
  }
}

async function remove(id) {
  if (!confirm('Delete this job?')) return
  try {
    await jobsApi.delete(id)
    jobs.value = jobs.value.filter((j) => j._id !== id)
  } catch (e) {
    error.value = e.message || 'Failed to delete'
  }
}

onMounted(fetchJobs)
</script>

<style scoped>
.manage-job {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
}
.manage-job h1 {
  margin: 0 0 1.25rem;
  font-size: 1.35rem;
  color: #1e293b;
}
.error {
  color: #dc2626;
}
.empty {
  color: #64748b;
}
.table-wrap {
  overflow-x: auto;
}
.jobs-table {
  width: 100%;
  border-collapse: collapse;
}
.jobs-table th,
.jobs-table td {
  padding: 0.6rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}
.jobs-table th {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
}
.jobs-table td {
  font-size: 0.95rem;
}
.btn-delete {
  padding: 0.35rem 0.6rem;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}
.btn-delete:hover {
  background: #fee2e2;
}
</style>
