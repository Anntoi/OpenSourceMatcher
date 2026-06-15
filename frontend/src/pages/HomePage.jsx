import { Link } from 'react-router-dom'
import PopularRepositoriesGrid from '../components/PopularRepositoriesGrid'
import { useFavorites } from '../context/FavoritesContext'

export default function HomePage() {
  const { favorites } = useFavorites()

  return (
    <div className="space-y-6 md:space-y-8">
      <section 
        className="rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-700 p-6 md:p-8 text-white shadow-large animate-slide-up"
        aria-labelledby="hero-heading"
      >
        <h1 id="hero-heading" className="text-2xl md:text-3xl font-bold animate-scale-in">OpenSource Matcher</h1>
        <p className="mt-3 max-w-2xl text-primary-100 text-sm md:text-base animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Découvrez des issues GitHub adaptées à votre niveau. Sauvegardez vos favorites avec l'étoile
          et retrouvez-les dans votre tableau de bord ou votre profil.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Link
            to="/issues"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50 hover:-translate-y-0.5 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 transition-all duration-300"
          >
            Rechercher des issues
          </Link>
          <Link
            to="/favorites"
            className="rounded-lg border border-white/40 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 transition-all duration-300"
            aria-label={`Mes favoris (${favorites.length} favoris)`}
          >
            Mes favoris {favorites.length > 0 && `(${favorites.length})`}
          </Link>
        </div>
      </section>

      <section aria-labelledby="popular-repos-heading" className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="mb-6">
          <h2 id="popular-repos-heading" className="text-xl md:text-2xl font-bold text-slate-900">🌟 Dépôts populaires</h2>
          <p className="mt-1 text-slate-600 text-sm md:text-base">
            Découvrez les meilleures issues des repositories les plus actifs
          </p>
        </div>

        <PopularRepositoriesGrid />
      </section>
    </div>
  )
}
