const MetricCard = ({ name, value, unit, percentage = null, threshold = null, status = 'healthy' }) => {
  const getColorByStatus = (status, percentage) => {
    if (status === 'healthy') return 'text-green-400';
    if (percentage && threshold && percentage >= threshold * 0.8) return 'text-yellow-400';
    if (percentage && threshold && percentage >= threshold) return 'text-red-400';
    return 'text-blue-400';
  };

  const getBarColor = (status, percentage) => {
    if (status === 'healthy') return 'bg-green-500';
    if (percentage && threshold && percentage >= threshold) return 'bg-red-500';
    if (percentage && threshold && percentage >= threshold * 0.8) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-400">{name}</h3>
        <span className={`text-xs font-medium ${getColorByStatus(status, percentage)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-2xl font-bold text-gray-100">{value}</span>
        {unit && <span className="text-sm text-gray-400">{unit}</span>}
      </div>

      {percentage !== null && (
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${getBarColor(status, percentage)}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}

      {threshold !== null && (
        <p className="text-xs text-gray-500 mt-2">Threshold: {threshold}{unit}</p>
      )}
    </div>
  );
};

export default MetricCard;
