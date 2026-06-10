import { Link } from 'react-router-dom';
const AdministrationHome = () => {
  const adminModules = [
    {
      name: 'Dashboard',
      description: 'Aperçu global de l\'application et des services',
      icon: '📊',
      link: '/admin/devops',
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'Monitoring',
      description: 'Métriques système et performances en temps réel',
      icon: '📈',
      link: '/admin/devops/monitoring',
      color: 'from-green-500 to-green-600',
    },
    {
      name: 'Pipelines',
      description: 'GitHub Actions workflows et CI/CD',
      icon: '⚙️',
      link: '/admin/devops/pipelines',
      color: 'from-purple-500 to-purple-600',
    },
    {
      name: 'Deployments',
      description: 'Historique et statut des déploiements',
      icon: '🚀',
      link: '/admin/devops/deployments',
      color: 'from-red-500 to-red-600',
    },
    {
      name: 'System Health',
      description: 'Vérification de l\'état de tous les services',
      icon: '🏥',
      link: '/admin/devops/health',
      color: 'from-yellow-500 to-yellow-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-100 mb-2">⚙️ Administration</h1>
          <p className="text-gray-400 text-lg">DevOps & Monitoring Dashboard</p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModules.map((module, idx) => (
            <Link
              key={idx}
              to={module.link}
              className="group relative overflow-hidden rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className="relative p-6 bg-gray-800 h-full flex flex-col justify-between">
                <div>
                  <div className="text-5xl mb-4">{module.icon}</div>
                  <h2 className="text-xl font-semibold text-gray-100 mb-2">{module.name}</h2>
                  <p className="text-sm text-gray-400">{module.description}</p>
                </div>
                
                <div className="mt-4 flex items-center text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span className="text-sm font-medium">Accéder</span>
                  <span className="ml-2">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <p className="text-gray-400 text-sm mb-2">Modules actifs</p>
            <p className="text-4xl font-bold text-blue-400">{adminModules.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <p className="text-gray-400 text-sm mb-2">Version</p>
            <p className="text-2xl font-bold text-purple-400">DevOps v1.0</p>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <p className="text-gray-400 text-sm mb-2">Statut</p>
            <p className="text-lg font-bold text-green-400">🟢 En ligne</p>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-3">📚 Guide d'utilisation</h3>
          <ul className="text-sm text-blue-300 space-y-2">
            <li>• <strong>Dashboard</strong> : Commencez par consulter le tableau de bord pour un aperçu global</li>
            <li>• <strong>Monitoring</strong> : Consultez les métriques système en temps réel</li>
            <li>• <strong>Pipelines</strong> : Suivez vos workflows CI/CD GitHub Actions</li>
            <li>• <strong>Deployments</strong> : Vérifiez l'historique des déploiements</li>
            <li>• <strong>System Health</strong> : Vérifiez l'état de tous les services</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdministrationHome;
