import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function MobileNav({ user, favorites }) {
  const [isOpen, setIsOpen] = useState(false)

  const linkClass = 'block px-3 py-2 text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50 rounded-md transition-colors'

  return (
    <div className="md:hidden">
      {/* Menu button */}
      <button
        type="button"
        className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu de navigation"
      >
        <span className="sr-only">Ouvrir le menu principal</span>
        {!isOpen ? (
          <svg
            className="block h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        ) : (
          <svg
            className="block h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </button>

      {/* Mobile menu */}
      {isOpen && (
        <div
          className="mt-2 space-y-1 pb-3 border-b border-slate-200 animate-slide-down"
          id="mobile-menu"
          role="menu"
        >
          <Link to="/" className={linkClass} role="menuitem" onClick={() => setIsOpen(false)}>
            Accueil
          </Link>
          <Link to="/issues" className={linkClass} role="menuitem" onClick={() => setIsOpen(false)}>
            Recherche
          </Link>
          <Link to="/demo" className={linkClass} role="menuitem" onClick={() => setIsOpen(false)}>
            Démo
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className={linkClass} role="menuitem" onClick={() => setIsOpen(false)}>
                Tableau de bord
              </Link>
              <Link to="/favorites" className={linkClass} role="menuitem" onClick={() => setIsOpen(false)}>
                Favoris {favorites.length > 0 && `(${favorites.length})`}
              </Link>
              <Link to="/profile" className={linkClass} role="menuitem" onClick={() => setIsOpen(false)}>
                Profil
              </Link>
              {user.is_admin && (
                <Link to="/admin" className={linkClass} role="menuitem" onClick={() => setIsOpen(false)}>
                  ⚙️ Admin
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass} role="menuitem" onClick={() => setIsOpen(false)}>
                Connexion
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}