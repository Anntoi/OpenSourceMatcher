import { useEffect, useState } from 'react';
import DeploymentTable from '../../components/devops/DeploymentTable';
import DevOpsNav from '../../components/devops/DevOpsNav';
import devopsService from '../../services/devops/devopsService';

const Deployments = () => {
  const [loading, setLoading] = useState(true);
  const [deployments, setDeployments] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        setLoading(true);
        const response = await devopsService.getDeployments(30);
        if (response.status === 'success') {
          setDeployments(response.data);
          setStats(response.stats);
        }
      } catch {
        // Error handled globally
      } finally {
        setLoading(false);
      }
    };

    fetchDeployments();

    const interval = setInterval(fetchDeployments, 25000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading deployments...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DevOpsNav />
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-100 mb-2">Deployments</h1>
            <p className="text-gray-400">Deployment history and status</p>
          </div>

          {stats && (
            <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                <p className="text-gray-400 text-sm mb-1">Total Deployments</p>
                <p className="text-3xl font-bold text-blue-400">{stats.total_deployments}</p>
              </div>
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                <p className="text-gray-400 text-sm mb-1">Successful</p>
                <p className="text-3xl font-bold text-green-400">{stats.successful}</p>
              </div>
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                <p className="text-gray-400 text-sm mb-1">Failed</p>
                <p className="text-3xl font-bold text-red-400">{stats.failed}</p>
              </div>
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                <p className="text-gray-400 text-sm mb-1">Success Rate</p>
                <p className="text-3xl font-bold text-green-400">{stats.success_rate}%</p>
              </div>
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                <p className="text-gray-400 text-sm mb-1">Avg Duration</p>
                <p className="text-3xl font-bold text-yellow-400">{stats.average_duration}</p>
              </div>
            </div>
          )}

          {stats && stats.last_deployment && (
            <div className="mb-6 bg-gray-800 rounded-lg border border-gray-700 p-4">
              <p className="text-gray-400 text-sm mb-2">Last Deployment</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-100">v{stats.last_deployment.version} to {stats.last_deployment.environment}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(stats.last_deployment.started_at).toLocaleString()}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  stats.last_deployment.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {stats.last_deployment.status === 'success' ? '✓ Success' : '✕ Failed'}
                </span>
              </div>
            </div>
          )}

          <DeploymentTable deployments={deployments} stats={stats} />
        </div>
      </div>
    </>
  );
};

export default Deployments;
