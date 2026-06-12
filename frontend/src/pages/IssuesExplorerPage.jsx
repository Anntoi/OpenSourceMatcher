import { useEffect, useState } from 'react'
import IssueCard from '../components/IssueCard'
import { GITHUB_REPO_NAME, GITHUB_REPO_OWNER, repositoryIssuesPath } from '../config/github'
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
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState(null)

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    const loadIssues = async () => {
      setLoading(true)
      setError(null)

      try {
        const { data } = await api.get(repositoryIssuesPath(), {
          params: { page, per_page: 30 },
          signal: controller.signal,
        })

        if (!cancelled) {
          const items = (data.data ?? []).map((issue) => ({
            ...issue,
            repository: `${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`,
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
  }, [page])

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Issues GitHub</h1>
        <p className="mt-1 text-slate-600">
          Issues chargées en direct depuis{' '}
          <a
            href={`https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-indigo-600 hover:underline"
          >
            {GITHUB_REPO_OWNER}/{GITHUB_REPO_NAME}
          </a>
          . Utilisez l&apos;étoile sur chaque carte pour sauvegarder.
        </p>
      </header>

      {loading && (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          Chargement des issues depuis GitHub…
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
    </section>
  )
}
