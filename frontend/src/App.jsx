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
import DemoPage from './pages/DemoPage'
import MobileNav from './components/MobileNav'

function NavLinks() {
  const { user } = useAuth()
  const { favorites } = useFavorites()

  const linkClass = 'text-slate-700 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1 transition-all duration-200 hover:-translate-y-0.5'

  return (
    <>
      <Link to="/" className={linkClass} aria-label="Page d'accueil">
        Accueil
      </Link>
      <Link to="/issues" className={linkClass} aria-label="Rechercher des issues GitHub">
        Recherche
      </Link>
      <Link to="/demo" className={linkClass} aria-label="Page de démonstration">
        Démo
      </Link>
      {user ? (
        <>
          <Link to="/dashboard" className={linkClass} aria-label="Tableau de bord personnel">
            Tableau de bord
          </Link>
          <Link 
            to="/favorites" 
            className={`${linkClass} inline-flex items-center gap-1`}
            aria-label={`Mes favoris (${favorites.length} favoris)`}
          >
            Favoris
            {favorites.length > 0 && (
              <span className="rounded-full bg-warning-100 px-1.5 text-xs font-semibold text-warning-700 animate-scale-in" aria-label={`${favorites.length} favoris`}>
                {favorites.length}
              </span>
            )}
          </Link>
          <Link to="/profile" className={linkClass} aria-label="Mon profil">
            Profil
          </Link>
          {user.is_admin && (
            <div className="border-l border-slate-200 pl-4 ml-2" role="separator" aria-orientation="vertical">
              <Link to="/admin" className="text-danger-600 hover:text-danger-700 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-2 rounded px-2 py-1 transition-all duration-200 hover:-translate-y-0.5">
                ⚙️ Admin
              </Link>
            </div>
          )}
        </>
      ) : (
        <>
          <Link to="/login" className={linkClass} aria-label="Se connecter">
            Connexion
          </Link>
        </>
      )}
    </>
  )
}

function AppLayout() {
  const { user } = useAuth()
  const { favorites } = useFavorites()

  return (
    <div className="min-h-screen bg-slate-50">
      <nav 
        className="border-b border-slate-200 bg-white px-4 md:px-6 py-4 shadow-sm"
        role="navigation"
        aria-label="Navigation principale"
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <Link 
            to="/" 
            className="text-lg font-bold text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1 transition-colors"
            aria-label="OpenSource Matcher - Retour à l'accueil"
          >
            OpenSource Matcher
          </Link>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex flex-wrap items-center gap-5 text-sm font-medium" role="menubar">
            <NavLinks />
          </div>
          
          {/* Mobile navigation */}
          <MobileNav user={user} favorites={favorites} />
        </div>
      </nav>
      <main className="mx-auto max-w-6xl p-4 md:p-6" role="main">
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
          <Route path="/demo" element={<DemoPage />} />

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