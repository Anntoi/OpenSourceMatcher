
const HealthTable = ({ services = [] }) => {
  const getStatusIcon = (status) => {
    const icons = {
      online: '🟢',
      offline: '🔴',
      unavailable: '🟡',
      healthy: '🟢',
      degraded: '🟡',
    };
    return icons[status] || '❓';
  };

  const getStatusColor = (status) => {
    const colors = {
      online: 'text-green-400',
      offline: 'text-red-400',
      unavailable: 'text-yellow-400',
      healthy: 'text-green-400',
      degraded: 'text-yellow-400',
    };
    return colors[status] || 'text-gray-400';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Health Check Status</h3>

      <div className="space-y-3">
        {services && Object.values(services).length > 0 ? (
          Object.values(services).map((service, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 bg-gray-700/30 rounded border border-gray-700">
              <span className="text-2xl">{getStatusIcon(service.status)}</span>
              
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-100">{service.name}</h4>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{service.message}</p>
              </div>

              <div className="text-right">
                <p className={`text-sm font-medium ${getStatusColor(service.status)}`}>
                  {service.status.toUpperCase()}
                </p>
                {service.response_time !== null && (
                  <p className="text-xs text-gray-400 mt-1">
                    {service.response_time.toFixed(0)}ms
                  </p>
                )}
              </div>

              <div className="text-right min-w-fit">
                <p className="text-xs text-gray-400">
                  Last check
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(service.last_check)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-6">No health data available</p>
        )}
      </div>
    </div>
  );
};

export default HealthTable;
