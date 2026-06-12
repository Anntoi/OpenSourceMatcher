import { Link } from 'react-router-dom'
import PopularRepositoriesGrid from '../components/PopularRepositoriesGrid'
import { useFavorites } from '../context/FavoritesContext'

export default function HomePage() {
  const { favorites } = useFavorites()

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
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">🌟 Dépôts populaires</h2>
          <p className="mt-1 text-slate-600">
            Découvrez les meilleures issues des repositories les plus actifs
          </p>
        </div>

        <PopularRepositoriesGrid />
      </section>
    </div>
  )
}
