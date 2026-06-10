import { useEffect, useState } from 'react';
import HealthTable from '../../components/devops/HealthTable';
import DevOpsNav from '../../components/devops/DevOpsNav';
import devopsService from '../../services/devops/devopsService';
const SystemHealth = () => {
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState({
    status: 'healthy',
    services: {},
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        setLoading(true);
        const response = await devopsService.getHealth();
        if (response.status === 'success') {
          setHealth(response.data);
        }
      } catch {
        // Error handled globally
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();

    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading system health...</p>
        </div>
      </div>
    );
  }

  const isHealthy = health.status === 'healthy';
  const onlineCount = Object.values(health.services).filter(s => s.status === 'online').length;
  const totalServices = Object.values(health.services).length;

  return (
    <>
      <DevOpsNav />
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-100 mb-2">System Health</h1>
            <p className="text-gray-400">Comprehensive health check of all services</p>
          </div>
        </div>

        <div className="mb-8 bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-100">Overall Status</h2>
            <div className={`text-4xl ${isHealthy ? 'text-green-400' : 'text-yellow-400'}`}>
              {isHealthy ? '\u{1F7E2}' : '\u{1F7E1}'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Status</p>
              <p className={`text-2xl font-bold ${isHealthy ? 'text-green-400' : 'text-yellow-400'}`}>
                {health.status.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Services Online</p>
              <p className="text-2xl font-bold text-blue-400">
                {onlineCount} / {totalServices}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Last Check</p>
              <p className="text-2xl font-bold text-purple-400">
                {new Date(health.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        <HealthTable services={health.services} />

        <div className="mt-8 bg-gray-800 rounded-lg border border-gray-700 p-4">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Detailed Information</h3>

          <div className="space-y-4">
            {health.services && Object.entries(health.services).map(([key, service]) => (
              <div key={key} className="border-t border-gray-700 pt-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-100">{service.name}</h4>
                  <span className={`text-sm font-medium ${
                    service.status === 'online' ? 'text-green-400' : service.status === 'unavailable' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {service.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Response Time</p>
                    <p className="text-gray-200 font-mono">{service.response_time.toFixed(2)}ms</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Last Check</p>
                    <p className="text-gray-200 font-mono text-xs">
                      {new Date(service.last_check).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Message</p>
                    <p className="text-gray-300 text-xs line-clamp-2">{service.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <h3 className="font-semibold text-blue-400 mb-2">Service Information</h3>
          <ul className="text-sm text-blue-300 space-y-1">
            <li>• Backend API: Laravel API server</li>
            <li>• PostgreSQL Database: Primary data store</li>
            <li>• GitHub API: External CI/CD integration</li>
            <li>• Docker: Container environment</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SystemHealth;
