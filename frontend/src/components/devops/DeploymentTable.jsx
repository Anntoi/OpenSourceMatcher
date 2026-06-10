import { useState } from 'react';

const DeploymentTable = ({ deployments = [], stats = null }) => {
  const [filter, setFilter] = useState('all');

  const getStatusBadge = (status) => {
    const badges = {
      success: { color: 'bg-green-500/20 text-green-400', icon: '✓' },
      in_progress: { color: 'bg-blue-500/20 text-blue-400', icon: '⟳' },
      pending: { color: 'bg-yellow-500/20 text-yellow-400', icon: '⧗' },
      failed: { color: 'bg-red-500/20 text-red-400', icon: '✕' },
      default: { color: 'bg-gray-500/20 text-gray-400', icon: '?' },
    };

    const badge = badges[status] || badges.default;
    return badge;
  };

  const getEnvironmentBadge = (env) => {
    const colors = {
      production: 'bg-red-500/20 text-red-400',
      staging: 'bg-yellow-500/20 text-yellow-400',
      development: 'bg-blue-500/20 text-blue-400',
    };
    return colors[env] || 'bg-gray-500/20 text-gray-400';
  };

  const filteredDeployments = filter === 'all'
    ? deployments
    : deployments.filter(d => d.status === filter);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-100">Deployments</h3>
        {stats && (
          <div className="flex gap-4 text-xs">
            <div>
              <span className="text-gray-400">Success Rate: </span>
              <span className="text-green-400 font-semibold">{stats.success_rate}%</span>
            </div>
            <div>
              <span className="text-gray-400">Avg Duration: </span>
              <span className="text-blue-400 font-semibold">{stats.average_duration}</span>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          {['all', 'success', 'failed', 'in_progress'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 text-xs rounded ${
                filter === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-2 font-semibold text-gray-300">Version</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-300">Environment</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-300">Status</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-300">Branch</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-300">Author</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-300">Date</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-300">Duration</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeployments.length > 0 ? (
              filteredDeployments.map((deployment) => {
                const badge = getStatusBadge(deployment.status);
                const envColor = getEnvironmentBadge(deployment.environment);
                return (
                  <tr key={deployment.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                    <td className="py-3 px-2 font-mono text-blue-400">{deployment.version}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${envColor}`}>
                        {deployment.environment}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${badge.color}`}>
                        {badge.icon} {deployment.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-400">{deployment.branch}</td>
                    <td className="py-3 px-2 text-gray-400">{deployment.author}</td>
                    <td className="py-3 px-2 text-gray-400 text-xs">{formatDate(deployment.started_at)}</td>
                    <td className="py-3 px-2 text-gray-400">{deployment.duration}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="py-6 text-center text-gray-400">
                  No deployments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeploymentTable;
