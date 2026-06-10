const StatusCard = ({ name, status, responseTime = null, message = null }) => {
  const statusColor = {
    online: 'text-green-500',
    offline: 'text-red-500',
    unavailable: 'text-yellow-500',
    healthy: 'text-green-500',
    degraded: 'text-yellow-500',
  };

  const statusBgColor = {
    online: 'bg-green-500/10',
    offline: 'bg-red-500/10',
    unavailable: 'bg-yellow-500/10',
    healthy: 'bg-green-500/10',
    degraded: 'bg-yellow-500/10',
  };

  const statusIndicator = {
    online: '\u{1F7E2}',
    offline: '\u{1F534}',
    unavailable: '\u{1F7E1}',
    healthy: '\u{1F7E2}',
    degraded: '\u{1F7E1}',
  };

  return (
    <div className={`p-4 rounded-lg border border-gray-700 ${statusBgColor[status] || 'bg-gray-800'}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-200">{name}</h3>
        <span className="text-lg">{statusIndicator[status] || '\u2753'}</span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className={`text-sm font-medium ${statusColor[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {responseTime !== null && (
        <p className="text-xs text-gray-400">
          Response: {responseTime.toFixed(0)}ms
        </p>
      )}

      {message && (
        <p className="text-xs text-gray-400 mt-1 line-clamp-1">
          {message}
        </p>
      )}
    </div>
  );
};

export default StatusCard;
