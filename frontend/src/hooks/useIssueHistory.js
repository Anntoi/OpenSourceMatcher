import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const STORAGE_KEY = 'osm_issue_history'
const MAX_ITEMS = 50

function readLocalHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeLocalHistory(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)))
}

export function useIssueHistory() {
  const { user } = useAuth()
  const isLoggedIn = Boolean(user)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(!isLoggedIn)

  // Load initial history
  useEffect(() => {
    if (!isLoggedIn) {
      setHistory(readLocalHistory())
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    api
      .get('/history', { params: { per_page: 50 } })
      .then(({ data }) => {
        if (!cancelled) {
          const items = (data.data ?? []).map((v) => ({
            number: v.issue_number,
            title: v.title,
            repository: v.repository,
            url: v.url,
            labels: v.labels ?? [],
            difficulty: v.difficulty ?? 'all-levels',
            viewedAt: v.viewed_at,
          }))
          setHistory(items)
        }
      })
      .catch(() => {
        if (!cancelled) setHistory([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [isLoggedIn])

  const addToHistory = useCallback(
    (issue) => {
      const entry = {
        number: issue.number,
        title: issue.title,
        repository: issue.repository,
        url: issue.url,
        labels: issue.labels ?? [],
        difficulty: issue.difficulty ?? 'all-levels',
        viewedAt: new Date().toISOString(),
      }

      if (isLoggedIn) {
        // Persist to server
        api.post('/history', {
          issue_number: entry.number,
          title: entry.title,
          repository: entry.repository,
          url: entry.url,
          labels: entry.labels,
          difficulty: entry.difficulty,
        }).catch(() => {
          // Silently fail — local fallback
        })

        // Optimistic update
        setHistory((prev) => {
          const filtered = prev.filter((i) => i.number !== entry.number)
          return [entry, ...filtered].slice(0, MAX_ITEMS)
        })
      } else {
        // Local storage only
        setHistory((prev) => {
          const filtered = prev.filter((i) => i.number !== entry.number)
          const next = [entry, ...filtered].slice(0, MAX_ITEMS)
          writeLocalHistory(next)
          return next
        })
      }
    },
    [isLoggedIn],
  )

  const clearHistory = useCallback(() => {
    if (isLoggedIn) {
      api.delete('/history').catch(() => {})
    }
    writeLocalHistory([])
    setHistory([])
  }, [isLoggedIn])

  const removeFromHistory = useCallback(
    (issueNumber) => {
      if (isLoggedIn) {
        api.delete(`/history/${issueNumber}`).catch(() => {})
      }
      setHistory((prev) => {
        const next = prev.filter((i) => i.number !== issueNumber)
        if (!isLoggedIn) writeLocalHistory(next)
        return next
      })
    },
    [isLoggedIn],
  )

  return { history, loading, addToHistory, clearHistory, removeFromHistory }
}
