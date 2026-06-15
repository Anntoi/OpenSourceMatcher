import { useEffect, useLayoutEffect, useState } from 'react'
import IssueCard from '../components/IssueCard'
import RepositorySelectorCard from '../components/RepositorySelectorCard'
import { repositoryIssuesPath } from '../config/github'
import api from '../services/api'

function getErrorMessage(err) {
  const status = err.response?.status
  const message = err.response?.data?.message

  if (status === 404) return 'Dépôt GitHub introuvable.'
  if (status === 429) return 'Limite de requêtes GitHub atteinte. Réessayez plus tard.'
  if (message) return message

  return "Impossible de charger les issues depuis GitHub."
}

export default function IssuesExplorerPage() {
  const [selectedRepository, setSelectedRepository] = useState(null)
  const [customRepo, setCustomRepo] = useState('')
  const [globalQuery, setGlobalQuery] = useState('')
  const [popularRepositories, setPopularRepositories] = useState([])
  const [loadingRepos, setLoadingRepos] = useState(true)
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState(null)
  const [searchMode, setSearchMode] = useState('popular') // 'popular' | 'repo' | 'global'

  // Load popular repositories on mount
  useEffect(() => {
    const loadPopularRepos = async () => {
      try {
        const { data } = await api.get('/popular-repositories')
        setPopularRepositories(data.data ?? [])
      } catch (err) {
        console.error('Failed to load popular repositories:', err)
        setPopularRepositories([])
      } finally {
        setLoadingRepos(false)
      }
    }

    loadPopularRepos()
  }, [])

  // Reset state when repository changes
  useLayoutEffect(() => {
    if (!selectedRepository && searchMode !== 'global') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIssues([])
      setMeta(null)
      setLoading(false)
    }
  }, [selectedRepository, searchMode])

  // Load issues when repository, global search, or page changes
  useEffect(() => {
    if (!selectedRepository && searchMode !== 'global') {
      return
    }

    let cancelled = false
    const controller = new AbortController()

    const loadIssues = async () => {
      setLoading(true)
      setError(null)

      try {
        let response

        if (searchMode === 'global') {
          // Search across all GitHub or within a specific repo
          response = await api.get('/issues', {
            params: {
              page,
              per_page: 30,
              repo: globalQuery.trim() || undefined,
            },
            signal: controller.signal,
          })
        } else {
          // Load issues for a specific repository
          response = await api.get(
            repositoryIssuesPath(selectedRepository.owner, selectedRepository.repo),
            {
              params: { page, per_page: 30 },
              signal: controller.signal,
            }
          )
        }

        if (!cancelled) {
          const { data } = response
          const items = (data.data ?? []).map((issue) => ({
            ...issue,
            repository: issue.repository || `${selectedRepository?.owner ?? ''}/${selectedRepository?.repo ?? ''}`,
          }))
          setIssues(items)
          setMeta({
            current_page: data.meta?.current_page ?? page,
            per_page: data.meta?.per_page ?? 30,
            total: data.meta?.total ?? items.length,
          })
        }
      } catch (err) {
        if (!cancelled && err.code !== 'ERR_CANCELED') {
          setError(getErrorMessage(err))
          setIssues([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadIssues()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [selectedRepository, searchMode, globalQuery, page])

  const handleSelectRepository = (repo) => {
    setSelectedRepository(repo)
    setSearchMode('repo')
    setPage(1)
    setError(null)
  }

  const handleCustomRepository = (e) => {
    e.preventDefault()
    if (!customRepo.trim()) return

    const parts = customRepo.trim().split('/')
    if (parts.length !== 2) {
      setError('Format invalide. Utilisez : owner/repo')
      return
    }

    const [owner, repo] = parts
    setSelectedRepository({ owner, repo })
    setSearchMode('repo')
    setCustomRepo('')
    setPage(1)
    setError(null)
  }

  const handleGlobalSearch = (e) => {
    e.preventDefault()
    setSearchMode('global')
    setSelectedRepository(null)
    setPage(1)
    setError(null)
  }

  const handleBackToPopular = () => {
    setSearchMode('popular')
    setSelectedRepository(null)
    setGlobalQuery('')
    setIssues([])
    setMeta(null)
    setPage(1)
    setError(null)
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Explorateur d'Issues GitHub</h1>
        <p className="mt-1 text-slate-600">
          Sélectionnez un dépôt ou recherchez sur tout GitHub pour trouver des issues.
        </p>
      </header>

      {/* Search mode: repo input + global search */}
      <div className="flex flex-col gap-3">
        {/* Custom repository input */}
        <form onSubmit={handleCustomRepository} className="flex gap-2">
          <input
            type="text"
            value={customRepo}
            onChange={(e) => setCustomRepo(e.target.value)}
            placeholder="Ou saisissez owner/repo (ex: laravel/framework)"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Charger
          </button>
        </form>

        {/* Global search across all GitHub */}
        <form onSubmit={handleGlobalSearch} className="flex gap-2">
          <input
            type="text"
            value={globalQuery}
            onChange={(e) => setGlobalQuery(e.target.value)}
            placeholder="Rechercher sur tout GitHub (laisser vide pour tout GitHub, ou entrer owner/repo)"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Recherche globale
          </button>
        </form>
      </div>

      {/* Popular repositories (only when no search is active) */}
      {searchMode === 'popular' && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-900">Dépôts populaires</h2>
          {loadingRepos ? (
            <div className="flex items-center gap-2 text-slate-600">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              Chargement des dépôts…
            </div>
          ) : popularRepositories.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {popularRepositories.map((repo) => (
                <RepositorySelectorCard
                  key={`${repo.owner}/${repo.repo}`}
                  repository={repo}
                  isSelected={false}
                  onSelect={handleSelectRepository}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">Impossible de charger les dépôts populaires.</p>
          )}
        </div>
      )}

      {/* Active search results */}
      {(searchMode === 'repo' || searchMode === 'global') && (
        <>
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {searchMode === 'global'
                  ? `Recherche globale${globalQuery.trim() ? ` : ${globalQuery.trim()}` : ''}`
                  : `${selectedRepository.owner}/${selectedRepository.repo}`}
              </h2>
              <p className="text-sm text-slate-600">
                {searchMode === 'global'
                  ? 'Issues « good first issue » et « help wanted » sur tout GitHub'
                  : 'Affichage des issues ouvertes'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleBackToPopular}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
            >
              Retour
            </button>
          </div>

          {loading && (
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              Chargement des issues…
            </div>
          )}

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</p>
          )}

          {!loading && !error && (
            <>
              {issues.length === 0 ? (
                <p className="text-slate-600">Aucune issue trouvée.</p>
              ) : (
                <ul className="space-y-3">
                  {issues.map((issue) => (
                    <li key={issue.id ?? `${issue.repository}#${issue.number}`}>
                      <IssueCard issue={issue} />
                    </li>
                  ))}
                </ul>
              )}

              {meta && (
                <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                  <p className="text-sm text-slate-600">
                    Page {meta.current_page} — {meta.total} issue(s) affichée(s)
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
                    >
                      Précédent
                    </button>
                    <button
                      type="button"
                      disabled={issues.length < (meta.per_page ?? 30)}
                      onClick={() => setPage((p) => p + 1)}
                      className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  )
}
