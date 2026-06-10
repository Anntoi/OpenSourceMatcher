import { Link, useLocation } from 'react-router-dom';

const DevOpsNav = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/admin/devops', icon: '📊' },
    { label: 'Monitoring', path: '/admin/devops/monitoring', icon: '📈' },
    { label: 'Pipelines', path: '/admin/devops/pipelines', icon: '⚙️' },
    { label: 'Deployments', path: '/admin/devops/deployments', icon: '🚀' },
    { label: 'Health', path: '/admin/devops/health', icon: '🏥' },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link to="/admin/devops" className="text-2xl font-bold text-blue-400">
            ⚙️ DevOps Admin
          </Link>
          <Link to="/" className="text-gray-400 hover:text-gray-200 text-sm">
            ← Back to App
          </Link>
        </div>

        <div className="flex gap-1 flex-wrap">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default DevOpsNav;
