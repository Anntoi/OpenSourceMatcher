import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import SocialLoginButtons from '../components/SocialLoginButtons'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { user, loading, loginWithPassword } = useAuth()
  const [showDevLogin, setShowDevLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />
  }

  const handlePasswordLogin = async (event) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await loginWithPassword(email, password)
    } catch {
      setError('Identifiants invalides.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Connexion</h1>
        <p className="mt-2 text-sm text-slate-600">
          Connectez-vous avec votre compte GitHub ou Google.
        </p>
      </header>

      <SocialLoginButtons />

      <div className="border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={() => setShowDevLogin((value) => !value)}
          className="w-full text-center text-xs text-slate-500 hover:text-slate-700"
        >
          {showDevLogin ? 'Masquer la connexion développeur' : 'Connexion développeur (compte seed)'}
        </button>

        {showDevLogin && (
          <form onSubmit={handlePasswordLogin} className="mt-4 space-y-3">
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                placeholder="admin@example.com"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Mot de passe</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
            >
              {submitting ? 'Connexion…' : 'Se connecter'}
            </button>
            <p className="text-xs text-slate-500">
              Réservé aux comptes créés via <code className="rounded bg-slate-100 px-1">php artisan db:seed</code>{' '}
              (ex. admin local).
            </p>
          </form>
        )}
      </div>

      <p className="text-center text-xs text-slate-500">
        En continuant, vous acceptez que nous utilisions votre profil public pour créer votre compte.
      </p>
    </section>
  )
}
