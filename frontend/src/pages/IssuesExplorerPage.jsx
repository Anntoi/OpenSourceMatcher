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
  const [popularRepositories, setPopularRepositories] = useState([])
  const [loadingRepos, setLoadingRepos] = useState(true)
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState(null)

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
    if (!selectedRepository) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIssues([])
      setMeta(null)
      setLoading(false)
    }
  }, [selectedRepository])

  // Load issues when repository or page changes
  useEffect(() => {
    if (!selectedRepository) {
      return
    }

    let cancelled = false
    const controller = new AbortController()

    const loadIssues = async () => {
      setLoading(true)
      setError(null)

      try {
        const { data } = await api.get(
          repositoryIssuesPath(selectedRepository.owner, selectedRepository.repo),
          {
            params: { page, per_page: 30 },
            signal: controller.signal,
          }
        )

        if (!cancelled) {
          const items = (data.data ?? []).map((issue) => ({
            ...issue,
            repository: `${selectedRepository.owner}/${selectedRepository.repo}`,
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
  }, [selectedRepository, page])

  const handleSelectRepository = (repo) => {
    setSelectedRepository(repo)
    setPage(1)
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
    setCustomRepo('')
    setPage(1)
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Explorateur d'Issues GitHub</h1>
        <p className="mt-1 text-slate-600">
          Sélectionnez un dépôt pour charger ses issues dynamiquement.
        </p>
      </header>

      {/* Custom repository input */}
      <form onSubmit={handleCustomRepository} className="flex gap-2">
        <input
          type="text"
          value={customRepo}
          onChange={(e) => setCustomRepo(e.target.value)}
          placeholder="Ou saisissez owner/repo"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Charger
        </button>
      </form>

      {/* Popular repositories */}
      {!selectedRepository && (
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

      {/* Selected repository and issues */}
      {selectedRepository && (
        <>
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {selectedRepository.owner}/{selectedRepository.repo}
              </h2>
              <p className="text-sm text-slate-600">Affichage des issues ouvertes</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedRepository(null)
                setPage(1)
              }}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
            >
              Changer
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
                <p className="text-slate-600">Aucune issue trouvée pour ce dépôt.</p>
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
