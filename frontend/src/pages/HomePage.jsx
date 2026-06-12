import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import IssueCard from '../components/IssueCard'
import { GITHUB_REPO_NAME, GITHUB_REPO_OWNER, repositoryIssuesPath } from '../config/github'
import { useFavorites } from '../context/FavoritesContext'
import api from '../services/api'

export default function HomePage() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { favorites } = useFavorites()

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    api
      .get(repositoryIssuesPath(), { params: { per_page: 6 }, signal: controller.signal })
      .then(({ data }) => {
        if (!cancelled) {
          const items = (data.data ?? []).map((issue) => ({
            ...issue,
            repository: `${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`,
          }))
          setIssues(items)
        }
      })
      .catch((err) => {
        if (!cancelled && err.code !== 'ABORT_ERR') {
          setError('Impossible de charger les issues pour le moment.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [])

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">OpenSource Matcher</h1>
        <p className="mt-3 max-w-2xl text-indigo-100">
          Découvrez des issues GitHub adaptées à votre niveau. Sauvegardez vos favorites avec l&apos;étoile
          et retrouvez-les dans votre tableau de bord ou votre profil.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/issues"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
          >
            Rechercher des issues
          </Link>
          <Link
            to="/favorites"
            className="rounded-lg border border-white/40 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Mes favoris {favorites.length > 0 && `(${favorites.length})`}
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Issues à la une</h2>
            <p className="text-sm text-slate-600">
              Good first issue et help wanted — cliquez sur ☆ pour ajouter aux favoris.
            </p>
          </div>
          <Link to="/issues" className="text-sm font-medium text-indigo-600 hover:underline">
            Voir tout →
          </Link>
        </div>

        {loading && <p className="text-slate-500">Chargement des issues…</p>}
        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</p>
        )}
        {!loading && !error && (
          <ul className="space-y-3">
            {issues.map((issue) => (
              <li key={issue.id ?? issue.number}>
                <IssueCard issue={issue} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
