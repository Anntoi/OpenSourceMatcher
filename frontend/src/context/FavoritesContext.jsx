import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import { issueToFavoritePayload } from '../utils/issue'
import { useAuth } from './AuthContext'

const FavoritesContext = createContext(null)

function extractFavoritesList(responseData) {
  if (Array.isArray(responseData)) return responseData
  if (Array.isArray(responseData?.data)) return responseData.data
  return []
}

export function FavoritesProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(false)

  const refreshFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([])
      return
    }
    setLoading(true)
    try {
      const { data } = await api.get('/favorites', { params: { per_page: 100 } })
      setFavorites(extractFavoritesList(data))
    } catch {
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (authLoading) return

    let cancelled = false

    const load = async () => {
      if (!user) {
        if (!cancelled) setFavorites([])
        return
      }
      setLoading(true)
      try {
        const { data } = await api.get('/favorites', { params: { per_page: 100 } })
        if (!cancelled) setFavorites(extractFavoritesList(data))
      } catch {
        if (!cancelled) setFavorites([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [authLoading, user])

  const favoriteNumbers = useMemo(
    () => new Set(favorites.map((f) => f.issue_number)),
    [favorites],
  )

  const isFavorite = useCallback(
    (issueNumber) => favoriteNumbers.has(issueNumber),
    [favoriteNumbers],
  )

  const addFavorite = useCallback(async (issue) => {
    const payload = issueToFavoritePayload(issue)
    const { data } = await api.post('/favorites', payload)
    const created = data.data ?? data
    setFavorites((prev) => {
      const exists = prev.some((f) => f.issue_number === created.issue_number)
      if (exists) {
        return prev.map((f) =>
          f.issue_number === created.issue_number ? { ...f, ...created } : f,
        )
      }
      return [created, ...prev]
    })
    return created
  }, [])

  const removeFavorite = useCallback(async (issueNumber) => {
    await api.delete(`/favorites/${issueNumber}`)
    setFavorites((prev) => prev.filter((f) => f.issue_number !== issueNumber))
  }, [])

  const toggleFavorite = useCallback(
    async (issue) => {
      const number = issue.number ?? issue.issue_number
      if (isFavorite(number)) {
        await removeFavorite(number)
        return false
      }
      await addFavorite(issue)
      return true
    },
    [addFavorite, isFavorite, removeFavorite],
  )

  const value = useMemo(
    () => ({
      favorites,
      loading,
      favoriteNumbers,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      refreshFavorites,
    }),
    [
      favorites,
      loading,
      favoriteNumbers,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      refreshFavorites,
    ],
  )

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) {
    throw new Error('useFavorites doit être utilisé dans FavoritesProvider')
  }
  return ctx
}
