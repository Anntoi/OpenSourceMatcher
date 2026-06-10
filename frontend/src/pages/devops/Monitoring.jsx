import { useEffect, useState } from 'react';
import MetricCard from '../../components/devops/MetricCard';
import DevOpsNav from '../../components/devops/DevOpsNav';
import devopsService from '../../services/devops/devopsService';
const Monitoring = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    metrics: {},
    services: [],
    alerts: [],
  });

  useEffect(() => {
    const fetchMonitoringData = async () => {
      try {
        setLoading(true);
        const response = await devopsService.getMonitoring();
        if (response.status === 'success') {
          setData(response.data);
        }
      } catch {
        // Error handled globally
      } finally {
        setLoading(false);
      }
    };

    fetchMonitoringData();

    const interval = setInterval(fetchMonitoringData, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading monitoring data...</p>
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
            <h1 className="text-4xl font-bold text-gray-100 mb-2">System Monitoring</h1>
            <p className="text-gray-400">Real-time system metrics and performance</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Services Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.services && data.services.map((service, idx) => (
                <div key={idx} className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-100">{service.name}</h3>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400">
                      {service.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">Uptime: {service.uptime}</p>
                  <p className="text-sm text-gray-400">Last Update: {new Date(service.last_update).toLocaleTimeString()}</p>
                </div>
              ))}
            </div>
          </div>

          {data.alerts && data.alerts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Active Alerts</h2>
              <div className="space-y-3">
                {data.alerts.map(alert => (
                  <div key={alert.id} className="p-4 rounded border bg-blue-500/10 border-blue-500/30">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-blue-400">{alert.title}</p>
                        <p className="text-sm text-gray-300 mt-1">{alert.message}</p>
                      </div>
                      <span className="text-xs text-gray-400">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Monitoring;
