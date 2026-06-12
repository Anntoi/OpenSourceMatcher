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
        <p className="text-red-600">Erreur lors de l'appel à l'API.</p>
        <p className="text-sm text-slate-500">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {response && response.success ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-left text-green-900 shadow-sm">
          <h1 className="text-3xl font-bold mb-4">🚀 OpenSourceMatcher</h1>

          <p className="mb-4 text-lg">
            OpenSourceMatcher est une plateforme conçue pour aider les
            développeurs à découvrir facilement des projets open source
            correspondant à leurs compétences, leurs intérêts et leur niveau
            d'expérience.
          </p>

          <p className="mb-6">
            L'objectif est de réduire la difficulté rencontrée par de nombreux
            développeurs lorsqu'ils souhaitent contribuer à l'open source en
            leur proposant des projets pertinents ainsi que des opportunités de
            contribution accessibles.
          </p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">
              Fonctionnalités principales
            </h2>

            <ul className="list-disc pl-6 space-y-2">
              <li>🔍 Recherche de projets open source.</li>
              <li>📂 Exploration de repositories GitHub.</li>
              <li>🐞 Consultation des issues GitHub en temps réel.</li>
              <li>🏷️ Identification des issues « good first issue ».</li>
              <li>🤝 Facilitation de la contribution collaborative.</li>
              <li>📈 Suivi des opportunités de participation.</li>
              <li>⚙️ Déploiement automatisé via CI/CD.</li>
            </ul>
          </div>

          <div className="rounded-md bg-white border border-green-100 p-4">
            <h2 className="text-lg font-semibold mb-2">
              Démonstration CI/CD
            </h2>

            <p className="mb-2">
              Cette page constitue une nouvelle fonctionnalité ajoutée au
              projet.
            </p>

            <p className="mb-2">
              Après son développement en local, les modifications ont été
              envoyées sur GitHub via un push.
            </p>

            <p className="mb-2">
              La pipeline CI/CD a automatiquement :
            </p>

            <ul className="list-disc pl-6 space-y-1">
              <li>✅ Exécuté les tests du backend Laravel.</li>
              <li>✅ Vérifié et compilé le frontend React.</li>
              <li>✅ Généré les artefacts de build.</li>
              <li>✅ Déployé automatiquement l'application.</li>
            </ul>

            <p className="mt-4 font-medium text-green-700">
              La présence de cette page dans l'application confirme que le
              déploiement automatique a été exécuté avec succès.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
          <p className="font-medium">Réponse inattendue</p>
          <p className="text-sm mt-1">{JSON.stringify(response)}</p>
        </div>
      )}
    </div>
  );
}