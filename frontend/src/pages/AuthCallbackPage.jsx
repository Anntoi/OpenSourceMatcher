import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ERROR_MESSAGES = {
  oauth_failed: 'La connexion OAuth a échoué. Réessayez.',
  email_required: 'Votre compte doit partager une adresse e-mail avec l’application.',
}

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { completeOAuthLogin } = useAuth()
  const [asyncError, setAsyncError] = useState(null)

  const token = searchParams.get('token')
  const errorCode = searchParams.get('error')

  const paramError = errorCode
    ? (ERROR_MESSAGES[errorCode] ?? 'Connexion impossible.')
    : !token
      ? 'Jeton de connexion manquant.'
      : null

  useEffect(() => {
    if (paramError || !token) return

    let cancelled = false

    completeOAuthLogin(token)
      .then(() => {
        if (!cancelled) navigate('/dashboard', { replace: true })
      })
      .catch(() => {
        if (!cancelled) setAsyncError('Impossible de finaliser la connexion.')
      })

    return () => {
      cancelled = true
    }
  }, [token, paramError, completeOAuthLogin, navigate])

  const error = paramError ?? asyncError

  if (error) {
    return (
      <div className="mx-auto max-w-md rounded-xl bg-white p-8 text-center shadow">
        <p className="text-red-600">{error}</p>
        <Link to="/login" className="mt-4 inline-block text-indigo-600 underline">
          Retour à la connexion
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-8 text-center shadow">
      <p className="text-slate-600">Connexion en cours…</p>
    </div>
  )
}
