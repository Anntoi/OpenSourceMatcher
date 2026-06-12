import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import IssueCard from './IssueCard'
import api from '../services/api'

export default function PopularRepositoriesGrid() {
  const [repositories, setRepositories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    const loadRepositories = async () => {
      try {
        const { data } = await api.get('/popular-repositories-with-issues', {
          signal: controller.signal,
        })

        if (!cancelled) {
          setRepositories(data.data ?? [])
          setError(null)
        }
      } catch (err) {
        if (!cancelled && err.code !== 'ERR_CANCELED') {
          console.error('Failed to load popular repositories:', err)
          setError('Impossible de charger les dépôts populaires.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadRepositories()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-slate-600">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        Chargement des dépôts populaires…
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {repositories.map((repository) => (
        <div key={`${repository.owner}/${repository.repo}`} className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <img
                  src={repository.avatar_url}
                  alt={repository.owner}
                  className="h-6 w-6 rounded-full"
                />
                <h3 className="font-semibold text-slate-900">
                  {repository.owner}/{repository.repo}
                </h3>
              </div>
              {repository.description && (
                <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                  {repository.description}
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>⭐ {repository.stars.toLocaleString()}</span>
                <span>📂 {repository.open_issues_count} issues</span>
                {repository.language && <span>💻 {repository.language}</span>}
              </div>
            </div>
            <Link
              to={`/issues?repo=${repository.owner}/${repository.repo}`}
              className="ml-2 flex-shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 whitespace-nowrap"
            >
              Explorer
            </Link>
          </div>

          {repository.issues && repository.issues.length > 0 ? (
            <ul className="space-y-2 pl-8 border-l-2 border-indigo-200">
              {repository.issues.map((issue) => (
                <li key={issue.id ?? `${repository.owner}/${repository.repo}#${issue.number}`}>
                  <IssueCard issue={{ ...issue, repository: `${repository.owner}/${repository.repo}` }} showFavorite />
                </li>
              ))}
            </ul>
          ) : (
            <p className="pl-8 text-sm text-slate-500 italic">Aucune issue trouvée.</p>
          )}
        </div>
      ))}
    </div>
  )
}
