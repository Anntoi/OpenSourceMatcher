import { useState } from 'react'
import { Link } from 'react-router-dom'
import IssueCard from '../components/IssueCard'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import { normalizeIssue } from '../utils/issue'

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth()
  const { favorites } = useFavorites()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [saved, setSaved] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    const { data } = await api.put('/profile', { name, email })
    setUser(data.user)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const previewFavorites = favorites.slice(0, 3)
  const isOAuth = Boolean(user?.provider)

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="max-w-md space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center gap-4">
          {user?.avatar && (
            <img
              src={user.avatar}
              alt=""
              className="h-14 w-14 rounded-full border border-slate-200"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">Profil</h1>
            {isOAuth && (
              <p className="text-sm capitalize text-slate-500">
                Connecté via {user.provider}
              </p>
            )}
          </div>
        </div>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Nom</span>
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Email</span>
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 p-2"
            type="email"
            value={email}
            readOnly={isOAuth}
            disabled={isOAuth}
            onChange={(e) => setEmail(e.target.value)}
          />
          {isOAuth && (
            <span className="mt-1 block text-xs text-slate-500">
              Géré par votre compte {user.provider}.
            </span>
          )}
        </label>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-lg bg-slate-900 px-4 py-2 text-white" type="submit">
            Enregistrer
          </button>
          <button className="rounded-lg border px-4 py-2" type="button" onClick={logout}>
            Déconnexion
          </button>
        </div>
        {saved && <p className="text-sm text-emerald-600">Profil mis à jour.</p>}
      </form>

      <section className="rounded-xl border border-amber-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Mes favoris</h2>
            <p className="text-sm text-slate-600">
              {favorites.length} issue{favorites.length !== 1 ? 's' : ''} sauvegardée{favorites.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            to="/favorites"
            className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-600"
          >
            Gérer tous les favoris
          </Link>
        </div>

        {previewFavorites.length === 0 ? (
          <p className="text-slate-500">
            Aucun favori pour le moment.{' '}
            <Link to="/issues" className="text-indigo-600 underline">
              Explorer les issues
            </Link>
          </p>
        ) : (
          <ul className="space-y-3">
            {previewFavorites.map((fav) => (
              <li key={fav.id ?? fav.issue_number}>
                <IssueCard issue={normalizeIssue(fav)} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
