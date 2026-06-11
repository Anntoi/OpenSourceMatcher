import { useEffect, useState } from 'react';
import api from '../services/api';

export default function DemoPage() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get('/demo')
      .then(({ data }) => {
        setResponse(data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center py-8">Chargement…</p>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erreur lors de l’appel à l’API.</p>
        <p className="text-sm text-slate-500">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      {response && response.success ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-green-800">
          <p className="font-medium">✅ Pipeline réussi</p>
          <p className="text-sm mt-1">{response.message}</p>
        </div>
      ) : (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
          <p className="font-medium">❌ Réponse inattendue</p>
          <p className="text-sm mt-1">{JSON.stringify(response)}</p>
        </div>
      )}
    </div>
  );
}