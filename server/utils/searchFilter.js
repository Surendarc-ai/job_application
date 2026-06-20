export function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function buildSearchTokens(search) {
  return String(search)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(escapeRegex);
}

export function tokenRegex(token) {
  return new RegExp(token, 'i');
}
