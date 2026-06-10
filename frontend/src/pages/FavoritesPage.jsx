import { Link } from 'react-router-dom'
import FavoritesList from '../components/FavoritesList'
import { useFavorites } from '../context/FavoritesContext'

export default function FavoritesPage() {
  const { favorites } = useFavorites()

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Mes favoris</h1>
        <p className="mt-1 text-slate-600">
          Gérez toutes les issues que vous avez sauvegardées. Cliquez sur ★ pour retirer un favori.
        </p>
      </header>

      {favorites.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {favorites.length} issue{favorites.length > 1 ? 's' : ''} enregistrée{favorites.length > 1 ? 's' : ''} dans votre profil.
        </div>
      )}

      <FavoritesList />

      <p className="text-center text-sm text-slate-500">
        <Link to="/issues" className="text-indigo-600 hover:underline">
          Parcourir plus d&apos;issues
        </Link>
        {' · '}
        <Link to="/dashboard" className="text-indigo-600 hover:underline">
          Tableau de bord
        </Link>
      </p>
    </section>
  )
}
