import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FavoritesList from '../components/FavoritesList'
import IssueCard from '../components/IssueCard'
import { GITHUB_REPO_NAME, GITHUB_REPO_OWNER, repositoryIssuesPath } from '../config/github'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import { useIssueHistory } from '../hooks/useIssueHistory'
import api from '../services/api'

const TABS = [
  { id: 'overview', label: 'Aperçu' },
  { id: 'favorites', label: 'Favoris' },
  { id: 'history', label: 'Historique' },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const { favorites } = useFavorites()
  const { history, clearHistory, removeFromHistory } = useIssueHistory()
  const [activeTab, setActiveTab] = useState('overview')
  const [recentIssues, setRecentIssues] = useState([])
  const [loadingIssues, setLoadingIssues] = useState(true)

  useEffect(() => {
    api
      .get(repositoryIssuesPath(), { params: { per_page: 5 } })
      .then(({ data }) => {
        const items = (data.data ?? []).map((issue) => ({
          ...issue,
          repository: `${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`,
        }))
        setRecentIssues(items)
      })
      .catch(() => setRecentIssues([]))
      .finally(() => setLoadingIssues(false))
  }, [])

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="mt-1 text-slate-600">Bienvenue, {user?.name}.</p>
      </header>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-t-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.id
                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
            {tab.id === 'favorites' && favorites.length > 0 && (
              <span className="ml-1.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700">
                {favorites.length}
              </span>
            )}
            {tab.id === 'history' && history.length > 0 && (
              <span className="ml-1.5 rounded-full bg-slate-200 px-1.5 py-0.5 text-xs text-slate-700">
                {history.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-800">Favoris</p>
              <p className="mt-1 text-3xl font-bold text-amber-900">{favorites.length}</p>
              <button
                type="button"
                onClick={() => setActiveTab('favorites')}
                className="mt-2 text-sm text-amber-700 underline"
              >
                Voir tout
              </button>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-600">Historique</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{history.length}</p>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className="mt-2 text-sm text-indigo-600 underline"
              >
                Consulter
              </button>
            </div>
            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
              <p className="text-sm font-medium text-indigo-800">Explorer</p>
              <Link to="/issues" className="mt-2 inline-block text-sm font-medium text-indigo-700 underline">
                Rechercher des issues →
              </Link>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold">Suggestions récentes</h2>
            {loadingIssues ? (
              <p className="text-slate-500">Chargement…</p>
            ) : recentIssues.length === 0 ? (
              <p className="text-slate-500">Aucune issue disponible.</p>
            ) : (
              <ul className="space-y-3">
                {recentIssues.map((issue) => (
                  <li key={issue.id ?? issue.number}>
                    <IssueCard issue={issue} />
                  </li>
                ))}
              </ul>
            )}
            <Link to="/issues" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
              Voir toutes les issues
            </Link>
          </div>
        </div>
      )}

      {activeTab === 'favorites' && (
        <FavoritesList emptyMessage="Vous n'avez pas encore de favoris. Ajoutez-en depuis l'accueil ou la recherche." />
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-slate-600">
              Issues consultées récemment (stockées localement sur cet appareil).
            </p>
            {history.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              >
                Effacer l&apos;historique
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-600">
              <p>Aucun historique pour le moment.</p>
              <p className="mt-1 text-sm text-slate-500">
                Ouvrez une issue sur GitHub depuis l&apos;accueil ou la recherche pour la retrouver ici.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {history.map((issue) => (
                <li key={`${issue.number}-${issue.viewedAt}`} className="relative">
                  <IssueCard issue={issue} />
                  <button
                    type="button"
                    onClick={() => removeFromHistory(issue.number)}
                    className="absolute right-4 top-4 rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
                  >
                    Retirer
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  )
}
