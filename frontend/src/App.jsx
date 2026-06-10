import { Link, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'
import DashboardPage from './pages/DashboardPage'
import FavoritesPage from './pages/FavoritesPage'
import HomePage from './pages/HomePage'
import IssuesExplorerPage from './pages/IssuesExplorerPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'
import { useAuth } from './context/AuthContext'
import { useFavorites } from './context/FavoritesContext'
import AdministrationHome from './pages/devops/AdministrationHome'
import DevOpsDashboard from './pages/devops/Dashboard'
import DevOpsMonitoring from './pages/devops/Monitoring'
import DevOpsPipelines from './pages/devops/Pipelines'
import DevOpsDeployments from './pages/devops/Deployments'
import DevOpsSystemHealth from './pages/devops/SystemHealth'

function NavLinks() {
  const { user } = useAuth()
  const { favorites } = useFavorites()

  const linkClass = 'text-slate-700 hover:text-indigo-600'

  return (
    <>
      <Link to="/" className={linkClass}>
        Accueil
      </Link>
      <Link to="/issues" className={linkClass}>
        Recherche
      </Link>
      {user ? (
        <>
          <Link to="/dashboard" className={linkClass}>
            Tableau de bord
          </Link>
          <Link to="/favorites" className={`${linkClass} inline-flex items-center gap-1`}>
            Favoris
            {favorites.length > 0 && (
              <span className="rounded-full bg-amber-100 px-1.5 text-xs font-semibold text-amber-700">
                {favorites.length}
              </span>
            )}
          </Link>
          <Link to="/profile" className={linkClass}>
            Profil
          </Link>
          {user.is_admin && (
            <div className="border-l border-slate-200 pl-4 ml-2">
              <Link to="/admin" className="text-red-600 hover:text-red-700 font-semibold text-sm">
                ⚙️ Admin
              </Link>
            </div>
          )}
        </>
      ) : (
        <>
          <Link to="/login" className={linkClass}>
            Connexion
          </Link>
        </>
      )}
    </>
  )
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <Link to="/" className="text-lg font-bold text-indigo-600">
            OpenSource Matcher
          </Link>
          <div className="flex flex-wrap items-center gap-5 text-sm font-medium">
            <NavLinks />
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl p-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/issues" element={<IssuesExplorerPage />} />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* DevOps Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdministrationHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/devops"
            element={
              <ProtectedRoute requireAdmin>
                <DevOpsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/devops/monitoring"
            element={
              <ProtectedRoute requireAdmin>
                <DevOpsMonitoring />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/devops/pipelines"
            element={
              <ProtectedRoute requireAdmin>
                <DevOpsPipelines />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/devops/deployments"
            element={
              <ProtectedRoute requireAdmin>
                <DevOpsDeployments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/devops/health"
            element={
              <ProtectedRoute requireAdmin>
                <DevOpsSystemHealth />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <AppLayout />
      </FavoritesProvider>
    </AuthProvider>
  )
}
