const BASE = import.meta.env.VITE_API_URL || ''

async function request(path, options = {}) {
  const url = path.startsWith('http') ? path : `${BASE}${path}`
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || res.statusText)
  return data
}

export const authApi = {
  login(username, password) {
    return request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  },
  register(username, password) {
    return request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  },
}
