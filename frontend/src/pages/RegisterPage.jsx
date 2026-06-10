import { Navigate } from 'react-router-dom'

/** Inscription = même flux OAuth que la connexion */
export default function RegisterPage() {
  return <Navigate to="/login" replace />
}
