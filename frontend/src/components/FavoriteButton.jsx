import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'

export default function FavoriteButton({ issue, size = 'md', showLabel = false }) {
  const { user } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [pending, setPending] = useState(false)

  const issueNumber = issue.number ?? issue.issue_number
  const active = isFavorite(issueNumber)

  const sizeClasses = {
    sm: 'h-8 w-8 text-base',
    md: 'h-9 w-9 text-lg',
    lg: 'h-10 w-10 text-xl',
  }

  if (!user) {
    return (
      <Link
        to="/login"
        title="Connectez-vous pour ajouter aux favoris"
        className={`inline-flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:border-amber-300 hover:text-amber-500 ${sizeClasses[size]}`}
        aria-label="Se connecter pour favoriser"
      >
        ☆
      </Link>
    )
  }

  const handleClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (pending) return
    setPending(true)
    try {
      await toggleFavorite(issue)
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      title={active ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      aria-label={active ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      aria-pressed={active}
      className={`inline-flex items-center justify-center gap-1 rounded-full border transition disabled:opacity-50 ${
        active
          ? 'border-amber-400 bg-amber-50 text-amber-500 shadow-sm'
          : 'border-slate-200 bg-white text-slate-400 hover:border-amber-300 hover:text-amber-500'
      } ${showLabel ? 'px-3 py-1.5' : sizeClasses[size]}`}
    >
      <span className={active ? 'scale-110' : ''}>{active ? '★' : '☆'}</span>
      {showLabel && (
        <span className="text-xs font-medium">{active ? 'Favori' : 'Favoris'}</span>
      )}
    </button>
  )
}
