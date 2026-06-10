# DevOps Dashboard

Module d'administration réservé aux utilisateurs avec `is_admin = true`.

## Accès

1. Exécuter `php artisan db:seed` pour créer le compte admin local.
2. Se connecter via **Connexion développeur** sur `/login` (`admin@example.com` / mot de passe défini par `APP_ADMIN_PASSWORD`, défaut : `password`).
3. Ouvrir **⚙️ Admin** dans la navigation.

Les utilisateurs OAuth standard n'ont pas accès à ce module.

## Architecture

```
frontend/src/pages/devops/     → Pages React (Dashboard, Monitoring, Pipelines, Deployments, Health)
frontend/src/services/devops/  → Client API Axios
backend/app/Http/Controllers/Api/DevOps/  → Contrôleurs API
backend/app/Services/DevOps/   → Services métier (GitHub Actions, Prometheus, Grafana, health checks)
```

Toutes les routes API sont sous `/api/v1/devops/*`, protégées par `auth:sanctum` et le middleware `admin`.

## Endpoints API

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/v1/devops/dashboard` | Vue d'ensemble (santé, métriques, pipelines récents, stats déploiements) |
| GET | `/api/v1/devops/health` | État des services (backend, PostgreSQL, GitHub API, Docker) |
| GET | `/api/v1/devops/monitoring` | Métriques système (Prometheus/Grafana ou données simulées) |
| GET | `/api/v1/devops/pipelines` | Workflows GitHub Actions du dépôt configuré |
| GET | `/api/v1/devops/deployments` | Historique des déploiements |

## Configuration

Variables dans `backend/.env` :

| Variable | Rôle |
|----------|------|
| `GITHUB_TOKEN` | API GitHub (pipelines, health check) — sans token, données mockées |
| `GITHUB_REPO_OWNER` | Propriétaire du dépôt pour les pipelines (défaut : `opensourcematcher`) |
| `GITHUB_REPO_NAME` | Nom du dépôt (défaut : `OpenSourceMatcher`) |
| `PROMETHEUS_URL` | URL Prometheus — sans URL, métriques simulées |
| `GRAFANA_URL` | URL Grafana |
| `GRAFANA_API_KEY` | Clé API Grafana |
| `DOCKER_HOST` | Socket Unix (`unix:///var/run/docker.sock`) ou URL HTTP du daemon Docker — si absent, le check Docker est ignoré (`unconfigured`) |

## Comportement des fallbacks

- **Pipelines / déploiements** : données mockées si `GITHUB_TOKEN` est absent ou si l'API échoue.
- **Monitoring** : métriques simulées si Prometheus/Grafana ne sont pas configurés.
- **Docker** : statut `unconfigured` sans `DOCKER_HOST` ; vérification du socket ou du daemon si configuré.

## Stack production (optionnelle)

`docker-compose.prod.yml` démarre PostgreSQL, Redis, backend, frontend, Prometheus et Grafana. Voir `docker/prometheus/` et `docker/grafana/provisioning/` pour la configuration.

## Dépannage

| Problème | Piste |
|----------|-------|
| 403 sur `/devops/*` | Vérifier `is_admin = true` sur l'utilisateur connecté |
| Pipelines vides / mock | Vérifier `GITHUB_TOKEN` et `GITHUB_REPO_OWNER` / `GITHUB_REPO_NAME` |
| Métriques à zéro | Configurer `PROMETHEUS_URL` ou accepter le mode simulé |
| Docker « unconfigured » | Définir `DOCKER_HOST` (ex. `unix:///var/run/docker.sock` sous Linux) |
