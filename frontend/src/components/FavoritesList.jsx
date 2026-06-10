import { useFavorites } from '../context/FavoritesContext'
import { normalizeIssue } from '../utils/issue'
import IssueCard from './IssueCard'

export default function FavoritesList({
  emptyMessage = 'Aucune issue en favoris pour le moment.',
}) {
  const { favorites, loading, refreshFavorites } = useFavorites()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-500">
        Chargement des favoris…
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
        <p className="text-4xl">☆</p>
        <p className="mt-3 text-slate-600">{emptyMessage}</p>
        <p className="mt-1 text-sm text-slate-500">
          Parcourez l&apos;accueil ou la recherche et cliquez sur l&apos;étoile pour sauvegarder une issue.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-600">
          {favorites.length} issue{favorites.length > 1 ? 's' : ''} sauvegardée{favorites.length > 1 ? 's' : ''}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => refreshFavorites()}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            Actualiser
          </button>
        </div>
      </div>
      <ul className="space-y-3">
        {favorites.map((fav) => {
          const issue = normalizeIssue(fav)
          return (
            <li key={fav.id ?? fav.issue_number}>
              <IssueCard issue={issue} showFavorite />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
