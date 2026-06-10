import { useEffect, useState } from 'react';
import DevOpsNav from '../../components/devops/DevOpsNav';
import StatusCard from '../../components/devops/StatusCard';
import MetricCard from '../../components/devops/MetricCard';
import PipelineTable from '../../components/devops/PipelineTable';
import devopsService from '../../services/devops/devopsService';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    services: {},
    metrics: {},
    recent_pipelines: [],
    deployment_stats: null,
    services_overview: [],
    alerts: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await devopsService.getDashboard();
        if (response.status === 'success') {
          setData(response.data);
        }
      } catch {
        // Error handled globally
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
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
            <h1 className="text-4xl font-bold text-gray-100 mb-2">DevOps Dashboard</h1>
            <p className="text-gray-400">Real-time monitoring and management</p>
          </div>

          {data.alerts && data.alerts.length > 0 && (
            <div className="mb-6 space-y-2">
              {data.alerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="p-3 rounded border bg-yellow-500/10 border-yellow-500/30">
                  <p className="text-sm font-medium text-yellow-400">⚠️ {alert.title}: {alert.message}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Service Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.services && Object.values(data.services).map((service, idx) => (
                <StatusCard
                  key={idx}
                  name={service.name}
                  status={service.status}
                  responseTime={service.response_time}
                  message={service.message}
                />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">System Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.metrics && Object.values(data.metrics).map((metric, idx) => (
                <MetricCard
                  key={idx}
                  name={metric.name}
                  value={metric.current}
                  unit={metric.unit}
                  percentage={metric.percentage}
                  threshold={metric.threshold}
                  status={metric.status}
                  history={metric.history}
                />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <PipelineTable pipelines={data.recent_pipelines} />
          </div>

          {data.deployment_stats && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Deployment Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                  <p className="text-gray-400 text-sm mb-1">Total Deployments</p>
                  <p className="text-3xl font-bold text-blue-400">{data.deployment_stats.total_deployments}</p>
                </div>
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                  <p className="text-gray-400 text-sm mb-1">Successful</p>
                  <p className="text-3xl font-bold text-green-400">{data.deployment_stats.successful}</p>
                </div>
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                  <p className="text-gray-400 text-sm mb-1">Failed</p>
                  <p className="text-3xl font-bold text-red-400">{data.deployment_stats.failed}</p>
                </div>
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                  <p className="text-gray-400 text-sm mb-1">Success Rate</p>
                  <p className="text-3xl font-bold text-green-400">{data.deployment_stats.success_rate}%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
