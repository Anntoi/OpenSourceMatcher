import { useState } from 'react';

const PipelineTable = ({ pipelines = [] }) => {
  const [filter, setFilter] = useState('all');

  const getStatusBadge = (status, conclusion) => {
    const badges = {
      completed: { color: 'bg-green-500/20 text-green-400', icon: '✓' },
      success: { color: 'bg-green-500/20 text-green-400', icon: '✓' },
      running: { color: 'bg-blue-500/20 text-blue-400', icon: '⟳' },
      pending: { color: 'bg-yellow-500/20 text-yellow-400', icon: '⧗' },
      failure: { color: 'bg-red-500/20 text-red-400', icon: '✕' },
      default: { color: 'bg-gray-500/20 text-gray-400', icon: '?' },
    };

    const key = conclusion || status || 'default';
    const badge = badges[key] || badges.default;

    return badge;
  };

  const filteredPipelines = filter === 'all' 
    ? pipelines 
    : pipelines.filter(p => p.status === filter);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-100">Workflows</h3>
        <div className="flex gap-2">
          {['all', 'completed', 'running', 'pending'].map(s => (
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
              <th className="text-left py-3 px-2 font-semibold text-gray-300">Workflow</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-300">Status</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-300">Branch</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-300">Commit</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-300">Duration</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-300">Author</th>
            </tr>
          </thead>
          <tbody>
            {filteredPipelines.length > 0 ? (
              filteredPipelines.map((pipeline) => {
                const badge = getStatusBadge(pipeline.status, pipeline.conclusion);
                return (
                  <tr key={pipeline.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                    <td className="py-3 px-2 text-gray-100">{pipeline.name}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${badge.color}`}>
                        {badge.icon} {pipeline.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-400">{pipeline.branch}</td>
                    <td className="py-3 px-2 font-mono text-blue-400">{pipeline.commit}</td>
                    <td className="py-3 px-2 text-gray-400">{pipeline.duration}</td>
                    <td className="py-3 px-2 text-gray-400">{pipeline.author}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-400">
                  No pipelines found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PipelineTable;
