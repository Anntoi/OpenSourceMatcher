/** URL de base du backend (sans /api/v1) */
export function getBackendUrl() {
  const apiUrl = import.meta.env.VITE_API_URL ?? 'https://opensourcematcher.onrender.com/api/v1'
  return apiUrl.replace(/\/api\/v1\/?$/, '')
}

export function getOAuthRedirectUrl(provider) {
  return `${getBackendUrl()}/auth/${provider}/redirect`
}
