import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AppLayout from '../components/AppLayout.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import AddJob from '../views/AddJob.vue'
import ManageJob from '../views/ManageJob.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { public: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { public: true },
  },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/add_job' },
      { path: 'add_job', name: 'AddJob', component: AddJob },
      { path: 'manage_job', name: 'ManageJob', component: ManageJob },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  const hasToken = !!auth.token
  if (to.meta.requiresAuth && !hasToken) {
    next({ name: 'Login' })
  } else if (to.meta.public && hasToken && (to.name === 'Login' || to.name === 'Register')) {
    next({ path: '/add_job' })
  } else {
    next()
  }
})

export default router
