import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'osm_issue_history'
const MAX_ITEMS = 50

function readHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeHistory(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)))
}

export function useIssueHistory() {
  const [history, setHistory] = useState(readHistory)

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setHistory(readHistory())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const addToHistory = useCallback((issue) => {
    const entry = {
      number: issue.number,
      title: issue.title,
      repository: issue.repository,
      url: issue.url,
      labels: issue.labels ?? [],
      difficulty: issue.difficulty ?? 'all-levels',
      viewedAt: new Date().toISOString(),
    }
    setHistory((prev) => {
      const filtered = prev.filter((i) => i.number !== entry.number)
      const next = [entry, ...filtered].slice(0, MAX_ITEMS)
      writeHistory(next)
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    writeHistory([])
    setHistory([])
  }, [])

  const removeFromHistory = useCallback((issueNumber) => {
    setHistory((prev) => {
      const next = prev.filter((i) => i.number !== issueNumber)
      writeHistory(next)
      return next
    })
  }, [])

  return { history, addToHistory, clearHistory, removeFromHistory }
}
