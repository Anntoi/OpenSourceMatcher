import { useEffect, useState } from 'react'
import IssueCard from '../components/IssueCard'
import api from '../services/api'

export default function IssuesExplorerPage() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    difficulty: '',
    language: '',
    page: 1,
  })
  const [meta, setMeta] = useState(null)

  useEffect(() => {
    let cancelled = false
    let debounceTimer

    const run = async () => {
      setLoading(true)
      setError(null)

      // Create abort controller for cancellation
      const controller = new AbortController()

      try {
        const params = {
          page: filters.page,
          per_page: 10,
        }
        if (filters.difficulty) params.difficulty = filters.difficulty
        if (filters.language.trim()) params.language = filters.language.trim()

        const { data } = await api.get('/issues', {
          params,
          signal: controller.signal,
        })
        if (!cancelled) {
          setIssues(data.data ?? [])
          setMeta(data.meta ?? null)
        }
      } catch (err) {
        if (!cancelled && err.code !== 'ABORT_ERR') {
          setError("Erreur lors de la recherche d'issues.")
          setIssues([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }

      return () => {
        controller.abort()
      }
    }

    // Debounce language input (300ms)
    if (filters.language && !filters.difficulty && filters.page === 1) {
      debounceTimer = setTimeout(() => {
        run()
      }, 300)
    } else {
      run()
    }

    return () => {
      cancelled = true
      clearTimeout(debounceTimer)
    }
  }, [filters])

  const handleSearch = (e) => {
    e.preventDefault()
    setFilters((f) => ({ ...f, page: 1 }))
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Recherche d&apos;issues</h1>
        <p className="mt-1 text-slate-600">
          Filtrez par difficulté et langage. Utilisez l&apos;étoile sur chaque carte pour sauvegarder.
        </p>
      </header>

      <form
        onSubmit={handleSearch}
        className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Difficulté</span>
          <select
            value={filters.difficulty}
            onChange={(e) => setFilters((f) => ({ ...f, difficulty: e.target.value, page: 1 }))}
            className="rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">Toutes</option>
            <option value="beginner">Débutant</option>
            <option value="intermediate">Intermédiaire</option>
            <option value="all-levels">Tous niveaux</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Langage</span>
          <input
            type="text"
            placeholder="ex. javascript, python"
            value={filters.language}
            onChange={(e) => setFilters((f) => ({ ...f, language: e.target.value }))}
            className="rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Rechercher
        </button>
      </form>

      {loading && <p className="text-slate-500">Recherche en cours…</p>}
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</p>
      )}

      {!loading && !error && (
        <>
          {issues.length === 0 ? (
            <p className="text-slate-600">Aucune issue trouvée avec ces critères.</p>
          ) : (
            <ul className="space-y-3">
              {issues.map((issue) => (
                <li key={`${issue.repository}#${issue.number}`}>
                  <IssueCard issue={issue} />
                </li>
              ))}
            </ul>
          )}

          {meta && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <p className="text-sm text-slate-600">
                Page {meta.current_page} — {meta.total} résultat(s)
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={filters.page <= 1}
                  onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                  className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
                >
                  Précédent
                </button>
                <button
                  type="button"
                  disabled={issues.length < (meta.per_page ?? 10)}
                  onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                  className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}
