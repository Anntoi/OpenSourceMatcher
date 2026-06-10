import { useEffect, useState } from 'react';
import PipelineTable from '../../components/devops/PipelineTable';
import DevOpsNav from '../../components/devops/DevOpsNav';
import devopsService from '../../services/devops/devopsService';

const Pipelines = () => {
  const [loading, setLoading] = useState(true);
  const [pipelines, setPipelines] = useState([]);

  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        setLoading(true);
        const response = await devopsService.getPipelines(30);
        if (response.status === 'success') {
          setPipelines(response.data);
        }
      } catch {
        // Error handled globally
      } finally {
        setLoading(false);
      }
    };

    fetchPipelines();

    const interval = setInterval(fetchPipelines, 20000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading pipelines...</p>
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
            <h1 className="text-4xl font-bold text-gray-100 mb-2">CI/CD Pipelines</h1>
            <p className="text-gray-400">GitHub Actions workflows and builds</p>
          </div>

          {pipelines.length > 0 && (
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                <p className="text-gray-400 text-sm mb-1">Total Runs</p>
                <p className="text-3xl font-bold text-blue-400">{pipelines.length}</p>
              </div>
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                <p className="text-gray-400 text-sm mb-1">Running</p>
                <p className="text-3xl font-bold text-blue-400">{pipelines.filter(p => p.status === 'running').length}</p>
              </div>
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                <p className="text-gray-400 text-sm mb-1">Success</p>
                <p className="text-3xl font-bold text-green-400">{pipelines.filter(p => p.conclusion === 'success').length}</p>
              </div>
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                <p className="text-gray-400 text-sm mb-1">Failed</p>
                <p className="text-3xl font-bold text-red-400">{pipelines.filter(p => p.conclusion === 'failure').length}</p>
              </div>
            </div>
          )}

          <PipelineTable pipelines={pipelines} />
        </div>
      </div>
    </>
  );
};

export default Pipelines;
