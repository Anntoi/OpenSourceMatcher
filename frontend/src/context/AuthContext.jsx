import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import api, { setAuthToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await api.get('/me')
      setUser(data)
      return data
    } catch {
      setAuthToken(null)
      setUser(null)
      return null
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      await fetchUser()
      setLoading(false)
    }
    init()
  }, [fetchUser])

  // Listen for token expiration from API interceptor
  useEffect(() => {
    const handleTokenExpired = () => {
      setUser(null)
    }
    window.addEventListener('token-expired', handleTokenExpired)
    return () => window.removeEventListener('token-expired', handleTokenExpired)
  }, [])

  const completeOAuthLogin = useCallback(
    async (token) => {
      setAuthToken(token)
      const data = await fetchUser()
      if (!data) {
        throw new Error('Unable to load user')
      }
      return data
    },
    [fetchUser],
  )

  const loginWithPassword = useCallback(
    async (email, password) => {
      const { data } = await api.post('/login', { email, password })
      setAuthToken(data.token)
      const userData = await fetchUser()
      if (!userData) {
        throw new Error('Unable to load user')
      }
      return userData
    },
    [fetchUser],
  )

  const logout = async () => {
    try {
      await api.post('/logout')
    } catch {
      // ignore if token already invalid
    }
    setAuthToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, completeOAuthLogin, loginWithPassword, logout, setUser, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
