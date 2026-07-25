# Rapport de Projet Académique

## OpenSource Matcher v2 — Plateforme de découverte d'issues open-source

---

| | |
|---|---|
| **Étudiant** | [Nom Prénom] |
| **Niveau** | Licence 3 / Bac+4 (cycle en 4 ans) |
| **Année universitaire** | 2025–2026 |
| **Type de projet** | Projet individuel (solo) |
| **Technologies** | Laravel 13, React 19, Docker, Prometheus, Grafana |
| **Date de soutenance** | [Date à compléter] |

---

## Remerciements

Je tiens à remercier [nom du tuteur/encadrant] pour son accompagnement tout au long de ce projet, ainsi que l'équipe pédagogique de [nom de l'établissement] pour la qualité de l'enseignement reçu durant ce cycle. Mes remerciements s'adressent également à la communauté open-source, dont les outils et la documentation ont été indispensables à la réalisation de ce projet.

---

## Sommaire

1. [Introduction générale](#1-introduction-générale)
2. [Contexte et présentation du projet](#2-contexte-et-présentation-du-projet)
3. [Analyse des besoins et cahier des charges](#3-analyse-des-besoins-et-cahier-des-charges)
4. [Choix technologiques et justification](#4-choix-technologiques-et-justification)
5. [Architecture et conception](#5-architecture-et-conception)
6. [Réalisation technique](#6-réalisation-technique)
7. [Tests et validation](#7-tests-et-validation)
8. [Déploiement et chaîne DevSecOps](#8-déploiement-et-chaîne-devsecops)
9. [Monitoring et observabilité](#9-monitoring-et-observabilité)
10. [Discussion critique et axes d'amélioration](#10-discussion-critique-et-axes-damélioration)
11. [Conclusion](#11-conclusion)
12. [Webographie](#12-webographie)
13. [Annexes](#13-annexes)

---

## 1. Introduction générale

### 1.1 Problématique

L'open-source est l'un des piliers de l'industrie logicielle moderne. Des projets comme Linux, React ou Laravel sont maintenus par des milliers de contributeurs à travers le monde. Pourtant, pour un développeur débutant ou intermédiaire, l'entrée dans l'écosystème open-source reste un défi : il est souvent difficile d'identifier les issues adaptées à son niveau d'expérience parmi les milliers de tickets ouverts sur GitHub.

GitHub propose bien des labels tels que `good first issue` et `help wanted`, mais leur utilisation n'est ni systématique ni normalisée. La recherche manuelle d'issues pertinentes nécessite de naviguer entre de multiples dépôts, de filtrer manuellement les résultats et d'évaluer la difficulté de chaque ticket — un processus fastidieux et décourageant pour les nouveaux contributeurs.

**Comment faciliter la découverte d'issues open-source adaptées au niveau d'expérience d'un développeur, tout en offrant une expérience utilisateur fluide et une infrastructure observable ?**

### 1.2 Objectifs du projet

Ce projet vise à concevoir et développer une plateforme web complète, **OpenSource Matcher**, permettant de :

1. **Rechercher et filtrer** des issues GitHub ouvertes, labellisées `good first issue` et `help wanted`, par niveau de difficulté et par langage de programmation.
2. **Sauvegarder des favoris** et conserver un **historique de consultation** des issues consultées.
3. **Authentifier les utilisateurs** via OAuth (GitHub, Google) pour une expérience sans friction.
4. **Fournir un tableau de bord DevOps** permettant de superviser l'état de l'application (santé des services, métriques système, pipelines CI/CD, déploiements).
5. **Conteneuriser** l'ensemble de l'application avec Docker et mettre en place une chaîne **CI/CD** automatisée.

### 1.3 Méthodologie

Le projet a été développé selon une méthodologie **itérative et incrémentale**. Chaque module (authentification, recherche d'issues, favoris, DevOps Dashboard, monitoring) a été conçu, implémenté puis testé de manière indépendante, avant d'être intégré dans l'application complète. Cette approche a permis de maintenir une base de code stable à chaque étape et de valider progressivement les fonctionnalités.

---

## 2. Contexte et présentation du projet

### 2.1 État de l'art

Plusieurs plateformes existent dans le domaine de la découverte de contributions open-source :

- **GitHub Explore** : page d'accueil proposant des dépôts recommandés, mais sans filtrage par niveau de difficulté.
- **Good First Issue** (goodfirstissue.dev) : agrège des issues `good first issue`, mais sans authentification ni personnalisation.
- **First Timers Only** (firsttimersonly.com) : ressource éducative orientée découverte, sans recherche dynamique.
- **Up For Grabs** (up-for-grabs.net) : liste manuellement maintenue de projets accueillants, sans intégration API en temps réel.

**Positionnement de OpenSource Matcher** : contrairement aux solutions existantes, notre plateforme combine la recherche en **temps réel** via l'API GitHub, une **authentification OAuth** permettant la personnalisation (favoris, historique), un **filtrage par niveau de difficulté** automatique (beginner, intermediate, all-levels), et un **tableau de bord DevOps** intégré — le tout dans une architecture conteneurisée et monitorée.

### 2.2 Public cible

| Cible | Cas d'usage |
|---|---|
| Développeur débutant | Trouver une première issue `good first issue` pour contribuer à un projet open-source |
| Développeur intermédiaire | Découvrir des issues `help wanted` dans un langage spécifique |
| Étudiant en informatique | S'entraîner sur des problèmes réels pour bâtir un portfolio |
| Administrateur (DevOps) | Superviser l'application via le dashboard intégré |

### 2.3 Périmètre fonctionnel

Le projet couvre les fonctionnalités suivantes :

- **Recherche d'issues** : recherche globale GitHub, par dépôt populaire, ou par dépôt personnalisé (owner/repo).
- **Filtrage par difficulté** : classification automatique basée sur les labels GitHub (`good first issue` → beginner, `help wanted` → intermediate, autre → all-levels).
- **Filtrage par langage** : filtrage via le paramètre `language:` de l'API GitHub Search.
- **Gestion des favoris** : ajout, suppression, consultation des issues sauvegardées.
- **Historique de consultation** : suivi des issues consultées avec timestamp.
- **Authentification OAuth** : connexion via GitHub et Google (Socialite), plus un compte admin local.
- **Profil utilisateur** : modification du nom et (conditionnellement) de l'email.
- **DevOps Dashboard** : vue agrégée de l'état du système, monitoring, pipelines, déploiements, santé des services.
- **Metrics Prometheus** : endpoint `/metrics` exposant des métriques au format Prometheus.

---

## 3. Analyse des besoins et cahier des charges

### 3.1 Besoins fonctionnels

| ID | Besoin | Priorité |
|---|---|---|
| BF-01 | Rechercher des issues GitHub avec filtres (difficulté, langage, dépôt) | Haute |
| BF-02 | Afficher des dépôts populaires avec leurs issues | Haute |
| BF-03 | Authentifier les utilisateurs via OAuth (GitHub, Google) | Haute |
| BF-04 | Permettre la connexion développeur (email/mot de passe) | Moyenne |
| BF-05 | Gérer les favoris (ajout, suppression, liste) | Haute |
| BF-06 | Gérer l'historique de consultation des issues | Moyenne |
| BF-07 | Gérer le profil utilisateur (modification du nom/email) | Moyenne |
| BF-08 | Fournir un dashboard DevOps (admin uniquement) | Haute |
| BF-09 | Exposer des métriques au format Prometheus | Moyenne |
| BF-10 | Support responsive (mobile, tablette, desktop) | Haute |

### 3.2 Besoins non-fonctionnels

| ID | Besoin | Catégorie |
|---|---|---|
| BNF-01 | L'API doit répondre en moins de 2 secondes (hors latence GitHub) | Performance |
| BNF-02 | Mise en cache des requêtes GitHub (15 min) pour limiter le rate limit | Performance |
| BNF-03 | Gestion des erreurs API GitHub (404, 429, 500) avec messages clairs | Robustesse |
| BNF-04 | Retry avec backoff exponentiel (3 tentatives) sur échec API GitHub | Robustesse |
| BNF-05 | Authentification par token Sanctum (stateless, sécurisé) | Sécurité |
| BNF-06 | Middleware d'administration (is_admin) pour les routes DevOps | Sécurité |
| BNF-07 | Conteneurisation Docker de l'ensemble des services | Déployabilité |
| BNF-08 | Pipeline CI/CD automatisé (GitHub Actions) | Déployabilité |
| BNF-09 | Monitoring avec Prometheus + Grafana | Observabilité |
| BNF-10 | Conformité WCAG 2.1 AA (accessibilité) | Accessibilité |

### 3.3 Cas d'utilisation principaux

**UC-01 : Rechercher une issue (visiteur)**
1. L'utilisateur accède à la page de recherche.
2. Il sélectionne un mode (dépôts populaires / dépôt personnalisé / recherche globale).
3. Il filtre par difficulté et/ou langage.
4. Le système interroge l'API GitHub (via le backend Laravel).
5. Les résultats sont affichés sous forme de cartes d'issues.

**UC-02 : Sauvegarder un favori (utilisateur authentifié)**
1. L'utilisateur clique sur l'icône favori d'une issue.
2. Le frontend envoie une requête `POST /favorites`.
3. Le backend crée l'enregistrement (ou le met à jour si déjà existant).
4. L'UI se met à jour de manière optimiste.

**UC-03 : Consulter le DevOps Dashboard (administrateur)**
1. L'admin se connecte avec le compte seedé.
2. Il accède au menu **⚙️ Admin**.
3. Le dashboard agrège les données : santé, métriques, pipelines, déploiements.
4. Les données sont rafraîchies toutes les 30 secondes.

---

## 4. Choix technologiques et justification

### 4.1 Backend : Laravel 13 (PHP 8.3)

| Critère | Justification |
|---|---|
| Écosystème mature | Laravel fournit un framework complet : routing, ORM Eloquent, migrations, middleware, file d'attente |
| Sanctum | Authentification API par token légère et sécurisée, idéale pour une SPA |
| Socialite | Intégration OAuth simplifiée (GitHub, Google) en quelques lignes |
| Éloquent ORM | Manipulation de la base de données expressive et sécurisée (requêtes préparées) |
| Habitabilité | PHP reste l'un des langages les plus utilisés dans l'industrie web, garantissant une faible courbe d'apprentissage |

**Alternatives envisagées** : Node.js/Express (rejeté pour la richesse native de Laravel en matière d'auth et d'ORM), Django (rejeté pour des raisons de familiarité avec l'écosystème PHP).

### 4.2 Frontend : React 19 + Vite 6

| Critère | Justification |
|---|---|
| React 19 | Écosystème dominant, hooks, composants réutilisables, virtual DOM performant |
| Vite 6 | Build ultra-rapide (ESBuild), HMR instantané, configuration simple |
| TailwindCSS 3.4 | Design system utility-first, responsive natif, personnalisation poussée |
| React Router 7 | Routing SPA déclaratif, nested routes, protection de routes |
| Axios | Intercepteurs de requêtes (token Bearer), gestion d'erreurs centralisée |

**Alternatives envisagées** : Vue.js (rejeté pour l'écosystème plus large de React), Angular (rejeté pour sa courbe d'apprentissage plus abrupte et son overhead pour un projet de cette taille).

### 4.3 Base de données : PostgreSQL 16

| Critère | Justification |
|---|---|
| Conformité ACID | Intégrité transactionnelle garantie |
| Support JSON | Stockage des labels d'issues en JSON natif (`json` cast Eloquent) |
| Performance | Excellent pour les requêtes relationnelles avec index |
| Open-source | Gratuit, largement supporté, compatible avec Supabase/Render |

### 4.4 Infrastructure et DevOps

| Technologie | Rôle | Justification |
|---|---|---|
| Docker / Docker Compose | Conteneurisation | Reproductibilité de l'environnement, isolation des services |
| GitHub Actions | CI/CD | Intégration native avec GitHub, YAML déclaratif, runners gratuits |
| Vercel | Hébergement frontend | Déploiement automatique, CDN global, optimisation SPA |
| Render | Hébergement backend | Support PHP natif, PostgreSQL/Redis managés, free tier |
| Prometheus | Collecte de métriques | Standard de facto, format texte simple, query language PromQL |
| Grafana | Visualisation | Dashboards interactifs, alerting, datasource Prometheus native |
| Redis 7 | Cache distribué | Réduction de la charge base de données, sessions, file d'attente |

### 4.5 Synthèse de la stack

```
┌─────────────────────────────────────────────────────────┐
│                    NAVIGATEUR CLIENT                      │
│               React 19 + TailwindCSS + Vite              │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS / API REST
┌────────────────────────▼────────────────────────────────┐
│                   BACKEND (Laravel 13)                    │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Sanctum  │  │  Socialite   │  │   GitHubService   │  │
│  │  (Auth)  │  │ (OAuth GH/Google)│ │  (API GitHub)   │  │
│  └──────────┘  └──────────────┘  └───────┬───────────┘  │
│  ┌──────────────────────────────────────┐ │              │
│  │  Eloquent ORM ←→ PostgreSQL 16      │ │              │
│  └──────────────────────────────────────┘ │              │
└──────────────────────────────────────────┼──────────────┘
                                           │ HTTPS
                                ┌──────────▼──────────┐
                                │   API GitHub (v3)   │
                                └─────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE DOCKER                    │
│  ┌──────────┐  ┌──────────┐  ┌────────┐  ┌───────────┐  │
│  │PostgreSQL│  │  Redis   │  │Prometheus│ │  Grafana  │  │
│  │   :5432  │  │  :6379   │  │  :9090  │  │   :3000   │  │
│  └──────────┘  └──────────┘  └────┬────┘  └─────┬─────┘  │
│                                   │scrape        │        │
│                          ┌────────▼──────────────▼─────┐  │
│                          │   Backend Laravel :8000     │  │
│                          │   /metrics (Prometheus)     │  │
│                          └────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 5. Architecture et conception

### 5.1 Architecture globale

Le projet adopte une **architecture client-serveur** avec une séparation claire des responsabilités :

- **Frontend (SPA React)** : gère l'UI, l'état local, et communique avec l'API via Axios.
- **Backend (API REST Laravel)** : expose des endpoints versionnés (`/api/v1`), gère la logique métier, l'authentification, et l'intégration avec l'API GitHub.
- **Base de données (PostgreSQL)** : persistance des utilisateurs, favoris et historique.
- **Services d'infrastructure** : Redis (cache), Prometheus (métriques), Grafana (visualisation).

Le projet est structuré en **monorepo** : le code frontend et backend coexistent dans le même dépôt Git, facilitant la coordination et le versionnement.

### 5.2 Architecture backend — Pattern en couches

Le backend Laravel suit une architecture en couches :

```
┌─────────────────────────────────────────────┐
│              Routes (routes/api.php)          │
│    Définition des endpoints + middleware      │
├─────────────────────────────────────────────┤
│            Controllers (Http/Controllers)     │
│   Validation des entrées, orchestration,      │
│   formatage des réponses (Resources)         │
├─────────────────────────────────────────────┤
│             Services (app/Services)           │
│    Logique métier réutilisable :              │
│    GitHubService, MonitoringService,          │
│    HealthCheckService, PipelineService,      │
│    DeploymentService, PrometheusService      │
├─────────────────────────────────────────────┤
│              Models (app/Models)              │
│    Eloquent ORM : User, Favorite,             │
│    IssueView, Issue                            │
├─────────────────────────────────────────────┤
│          Base de données (PostgreSQL)         │
└─────────────────────────────────────────────┘
```

**Justification du pattern Service** : la logique d'interaction avec l'API GitHub (construction de requêtes, cache, retry, mapping des données) est complexe et réutilisable. L'isoler dans un `GitHubService` permet de :
- Ne pas surcharger les contrôleurs (principe de séparation des responsabilités).
- Faciliter les tests unitaires (mock du service).
- Réutiliser la logique dans plusieurs contrôleurs (IssueController, DemoController).

### 5.3 Modèle de données

#### Schéma relationnel

```
┌──────────────────────┐       ┌──────────────────────┐
│       users          │       │    personal_access_  │
│──────────────────────│       │       tokens         │
│ id (PK)              │◄──┐   │──────────────────────│
│ name                 │   │   │ id (PK)              │
│ email (UNIQUE)       │   └──│ tokenable_id (FK)     │
│ password             │       │ name                 │
│ provider             │       │ token                │
│ provider_id          │       │ abilities            │
│ avatar               │       └──────────────────────┘
│ is_admin (BOOL)      │
│ timestamps           │       ┌──────────────────────┐
└──────┬───────────────┘       │      favorites       │
       │                       │──────────────────────│
       │ 1:N                   │ id (PK)              │
       ├──────────────────────►│ user_id (FK)         │
       │                       │ issue_number         │
       │                       │ title                │
       │                       │ repository           │
       │                       │ url                  │
       │                       │ labels (JSON)         │
       │                       │ difficulty            │
       │                       │ timestamps           │
       │                       │ UNIQUE(user_id,      │
       │                       │        issue_number) │
       │                       └──────────────────────┘
       │                       ┌──────────────────────┐
       │                       │    issue_views        │
       │                       │──────────────────────│
       └──────────────────────►│ id (PK)              │
                               │ user_id (FK)         │
                               │ issue_number         │
                               │ title                │
                               │ repository           │
                               │ url (VARCHAR 500)    │
                               │ labels (JSON)        │
                               │ difficulty            │
                               │ viewed_at (TIMESTAMP)│
                               │ UNIQUE(user_id,      │
                               │        issue_number) │
                               └──────────────────────┘
```

#### Détail des migrations

| Table | Colonnes principales | Particularités |
|---|---|---|
| `users` | id, name, email, password, provider, provider_id, avatar, is_admin | Champs OAuth ajoutés via migration séparée ; unique(provider, provider_id) |
| `favorites` | user_id (FK), issue_number, title, repository, url, labels (JSON), difficulty | Dédoublonnage via updateOrCreate sur (user_id, issue_number) |
| `issue_views` | user_id (FK), issue_number, title, repository, url, labels, difficulty, viewed_at | Pas de timestamps Laravel ; index sur (user_id, viewed_at) pour les requêtes récentes |
| `issues` | number, title, repository, url, labels (JSON), difficulty | Table de cache optionnelle ; unique(repository, number) |
| `personal_access_tokens` | tokenable_id, name, token, abilities | Sanctum — gère les tokens d'API |

### 5.4 Conception de l'API REST

#### Conventions

- **Versionnage** : préfixe `/api/v1` pour garantir la compatibilité ascendante.
- **Format de réponse** : JSON structuré avec `data` (résultats) et `meta` (pagination).
- **Codes HTTP sémantiques** : 200 (OK), 201 (Created), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 422 (Unprocessable Entity), 429 (Rate Limit), 502 (Bad Gateway).
- **Resources Laravel** : transformation des modèles en réponses JSON via `IssueResource`, `FavoriteResource`, `UserResource`.

#### Inventaire des endpoints

| Méthode | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/issues` | Public | Recherche globale d'issues (params: page, per_page, difficulty, language, repo) |
| GET | `/api/v1/popular-repositories` | Public | Liste des dépôts populaires |
| GET | `/api/v1/popular-repositories-with-issues` | Public | Dépôts populaires + leurs issues |
| GET | `/api/v1/repositories/{owner}/{repo}/issues` | Public | Issues d'un dépôt spécifique |
| POST | `/api/v1/login` | Public (throttle:6,1) | Connexion email/mot de passe |
| GET | `/api/v1/demo` | Public | Endpoint de démonstration |
| GET | `/api/v1/metrics` | Public | Métriques au format Prometheus |
| GET | `/api/v1/me` | Sanctum | Profil utilisateur connecté |
| POST | `/api/v1/logout` | Sanctum | Déconnexion (révoque le token) |
| GET | `/api/v1/favorites` | Sanctum | Liste des favoris (paginée) |
| POST | `/api/v1/favorites` | Sanctum | Ajouter/mettre à jour un favori |
| DELETE | `/api/v1/favorites/{issueNumber}` | Sanctum | Supprimer un favori |
| PUT | `/api/v1/profile` | Sanctum | Modifier le profil |
| GET | `/api/v1/history` | Sanctum | Historique de consultation |
| POST | `/api/v1/history` | Sanctum | Ajouter/mettre à jour une vue |
| DELETE | `/api/v1/history/{issueNumber}` | Sanctum | Supprimer une entrée d'historique |
| DELETE | `/api/v1/history` | Sanctum | Vider l'historique |
| GET | `/api/v1/devops/dashboard` | Admin | Vue agrégée DevOps |
| GET | `/api/v1/devops/health` | Admin | Santé des services |
| GET | `/api/v1/devops/pipelines` | Admin | Runs GitHub Actions |
| GET | `/api/v1/devops/deployments` | Admin | Historique des déploiements |
| GET | `/api/v1/devops/monitoring` | Admin | Métriques système temps réel |

#### Flux d'authentification OAuth

```
Utilisateur    Frontend (React)    Backend (Laravel)    GitHub/Google
     │               │                    │                    │
     │  Clic "GitHub" │                    │                    │
     │──────────────►│                    │                    │
     │               │  redirect vers      │                    │
     │               │  /auth/github/redirect                  │
     │               │──────────────────►│                    │
     │               │                    │  Socialite::driver  │
     │               │                    │  ('github')->redirect
     │               │                    │───────────────────►│
     │               │                    │                    │
     │               │     redirection vers GitHub login        │
     │◄─────────────────────────────────────────────────────────│
     │               │                    │                    │
     │  Autorise l'app│                    │                    │
     │─────────────────────────────────────────────────────────►│
     │               │                    │                    │
     │               │   callback vers    │                    │
     │               │   /auth/github/callback                  │
     │               │   ?code=...&state=...                   │
     │               │◄──────────────────│◄───────────────────│
     │               │                    │                    │
     │               │                    │  Socialite::user() │
     │               │                    │  findOrCreate()    │
     │               │                    │  createToken()     │
     │               │                    │                    │
     │               │  redirect vers     │                    │
     │               │  FRONTEND_URL/auth/callback              │
     │               │  ?token=xxx        │                    │
     │               │◄──────────────────│                    │
     │               │                    │                    │
     │  setAuthToken │                    │                    │
     │  fetchUser()  │                    │                    │
     │  → /dashboard │                    │                    │
     │◄──────────────│                    │                    │
```

### 5.5 Architecture frontend

#### Structure des composants

```
App.jsx
├── AuthProvider (contexte global d'authentification)
│   └── FavoritesProvider (contexte global des favoris)
│       └── AppLayout
│           ├── Navbar (desktop)
│           │   ├── NavLinks (auth-aware)
│           │   └── MobileNav (hamburger, responsive)
│           └── Routes
│               ├── /                → HomePage
│               ├── /login           → LoginPage
│               │   └── SocialLoginButtons
│               ├── /auth/callback   → AuthCallbackPage
│               ├── /dashboard       → DashboardPage (protégé)
│               │   ├── Tab: Aperçu (stats + suggestions)
│               │   ├── Tab: Favoris (FavoritesList)
│               │   └── Tab: Historique
│               ├── /issues          → IssuesExplorerPage
│               │   ├── RepositorySelectorCard
│               │   ├── PopularRepositoriesGrid
│               │   └── IssueCard (×N)
│               ├── /favorites       → FavoritesPage (protégé)
│               ├── /profile         → ProfilePage (protégé)
│               ├── /demo            → DemoPage
│               ├── /admin           → AdministrationHome (admin)
│               └── /admin/devops/*  → DevOps Dashboard (admin)
│                   ├── DevOpsNav
│                   ├── Dashboard (polling 30s)
│                   │   ├── StatusCard (×N services)
│                   │   ├── MetricCard (×N)
│                   │   ├── PipelineTable
│                   │   └── DeploymentTable
│                   ├── Monitoring
│                   ├── Pipelines
│                   ├── Deployments
│                   └── SystemHealth
```

#### Gestion de l'état

L'application utilise le **pattern Context + Hooks** de React :

| Provider / Hook | État géré | Persistance |
|---|---|---|
| `AuthContext` | user, loading, token | localStorage (`osm_token`) |
| `FavoritesContext` | favorites[], favoriteNumbers (Set) | Serveur (API) + état local optimiste |
| `useIssueHistory` | history[] | Serveur (API) si authentifié, sinon localStorage (`osm_issue_history`) |

**Mises à jour optimistes** : pour les favoris et l'historique, l'UI se met à jour immédiatement avant la confirmation du serveur, ce qui réduit la latence perçue.

#### Protection des routes

Le composant `ProtectedRoute` implémente un guard déclaratif :

```jsx
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>

<ProtectedRoute requireAdmin>
  <DevOpsDashboard />
</ProtectedRoute>
```

Trois états sont gérés :
1. **Chargement** : affichage d'un spinner.
2. **Non authentifié** : redirection vers `/login`.
3. **Non admin** (si `requireAdmin`) : redirection vers `/dashboard`.

---

## 6. Réalisation technique

### 6.1 Intégration de l'API GitHub

Le `GitHubService` est le cœur métier de l'application. Il encapsule toute l'interaction avec l'API GitHub Search et Repositories.

#### Construction des requêtes de recherche

```php
// Extrait simplifié de GitHubService::searchIssues()
$query = 'is:issue is:open archived:false';
$query .= ' (label:"good first issue" OR label:"help wanted")';

if ($repo) {
    $query .= " repo:{$repo}";
}
if ($language) {
    $query .= " language:{$language}";
}
```

La requête cible l'endpoint `GET /search/issues` avec :
- Tri par `created` (décroissant) pour afficher les issues les plus récentes.
- Pagination gérée via les paramètres `page` et `per_page`.

#### Classification automatique de la difficulté

```php
private function resolveDifficulty(array $labels): string
{
    $labelNames = array_map(fn($l) => strtolower($l['name'] ?? ''), $labels);

    if (in_array('good first issue', $labelNames)) {
        return 'beginner';
    }
    if (in_array('help wanted', $labelNames)) {
        return 'intermediate';
    }
    return 'all-levels';
}
```

Cette heuristique simple mais efficace permet de classifier automatiquement les issues sans intervention manuelle.

#### Gestion du rate limit

L'API GitHub impose des limites de débit (5 000 requêtes/heure pour les utilisateurs authentifiés). Le service implémente plusieurs stratégies d'atténuation :

1. **Cache** : les résultats sont mis en cache pendant 15 minutes (clé SHA256 de la requête complète).
2. **Retry avec backoff exponentiel** : 3 tentatives avec délai croissant (2s, 4s, 8s).
3. **Détection du rate limit** : interception des codes 403/429 avec lecture des en-têtes `X-RateLimit-Remaining`.
4. **Exceptions typées** : `GitHubApiException` avec codes spécifiques (`repositoryNotFound`, `rateLimitExceeded`, `apiError`).

```php
// Retry avec backoff exponentiel
for ($attempt = 1; $attempt <= 3; $attempt++) {
    $response = Http::withToken($token)
        ->timeout(10)
        ->get($url, $params);

    if ($response->successful()) {
        return $response->json();
    }

    if ($attempt < 3) {
        sleep(pow(2, $attempt)); // 2s, 4s
    }
}
```

#### Dépôts populaires

Une liste de 8 dépôts majeurs est préconfigurée :

| Dépôt | Langage |
|---|---|
| laravel/framework | PHP |
| facebook/react | JavaScript |
| microsoft/vscode | TypeScript |
| vercel/next.js | JavaScript |
| golang/go | Go |
| python/cpython | Python |
| torvalds/linux | C |
| kubernetes/kubernetes | Go |

Cette liste est mise en cache et peut être étendue facilement.

### 6.2 Authentification

#### Double mécanisme d'authentification

1. **OAuth (GitHub / Google)** : flux Socialite stateless. L'utilisateur est redirigé vers le provider, puis de retour sur le backend qui crée/met à jour l'utilisateur et génère un token Sanctum. Ce token est transmis au frontend via un paramètre d'URL (`?token=xxx`).

2. **Email / Mot de passe (développeur/admin)** : endpoint `POST /login` avec validation via `LoginRequest`, vérification du hash bcrypt, et émission d'un token Sanctum. Protégé par un throttle de 6 tentatives par minute.

#### Sécurité

- Les mots de passe sont hashés avec bcrypt (cast `hashed` sur le modèle User).
- Les tokens Sanctum sont stockés en base (table `personal_access_tokens`) et peuvent être révoqués.
- Le middleware `admin` vérifie le champ `is_admin` avant d'autoriser l'accès aux routes DevOps.
- Le throttle sur `/login` prévient les attaques par force brute.
- Les routes OAuth utilisent la validation `state` de Socialite pour prévenir les attaques CSRF.

### 6.3 Gestion des favoris et de l'historique

#### Favoris

- **Dédoublonnage** : utilisation de `updateOrCreate` sur la clé unique `(user_id, issue_number)`. Si l'utilisateur ajoute un favori déjà existant, l'enregistrement est mis à jour (titre, labels) plutôt que dupliqué.
- **Réponse optimisée** : le frontend maintient un `Set` des numéros d'issues favorites (`favoriteNumbers`) pour une vérification `isFavorite()` en O(1).
- **Mises à jour optimistes** : l'UI réfléchit immédiatement le changement avant la confirmation serveur.

#### Historique de consultation

- **Double stockage** : si l'utilisateur est authentifié, l'historique est persisté en base. Sinon, il est stocké dans `localStorage` (clé `osm_issue_history`, max 50 entrées).
- **Timestamp** : le champ `viewed_at` est rafraîchi à chaque consultation (`updateOrCreate`), permettant de trier par récence.
- **Index** : un index composite `(user_id, viewed_at)` optimise les requêtes d'historique récent.

### 6.4 DevOps Dashboard

Le DevOps Dashboard est un module administrateur complet qui agrège plusieurs sources de données :

#### DashboardController

Le contrôleur `DashboardController` orchestre plusieurs services et renvoie une vue agrégée :

| Donnée | Source | Fallback |
|---|---|---|
| Santé des services | `HealthCheckService` | État par défaut (online) |
| Métriques système | `MonitoringService` → Prometheus | Données simulées |
| Pipelines CI/CD | `PipelineService` → GitHub Actions API | Pipelines mockés (4 runs) |
| Statistiques de déploiement | `DeploymentService` | Déploiements mockés |
| Vue d'ensemble des services | `MonitoringService::getServicesStatus()` | Liste statique (6 services) |
| Alertes | `MonitoringService::getAlerts()` → Prometheus | Aucune alerte |

#### HealthCheckService

Vérifie en temps réel la disponibilité de quatre services :

| Service | Méthode de vérification |
|---|---|
| Backend API | Connexion PDO à la base de données |
| PostgreSQL | `SELECT NOW()` |
| GitHub API | `GET /user` (timeout 5s) |
| Docker | Ping sur `DOCKER_HOST` (socket Unix ou HTTP) |

Chaque service renvoie : `status` (online/offline/unconfigured), `response_time` (ms), `message`.

#### MonitoringService

Interroge Prometheus pour collecter :
- **CPU** : `process_cpu_usage`
- **Mémoire** : `process_memory_usage_bytes`
- **Temps de réponse** : `http_request_duration` (p95/p99)
- **Disque** : `node_filesystem_*`
- **Historique** : `queryRange` sur 24 heures

Si Prometheus est indisponible ou non configuré, le service bascule sur des **métriques simulées** — garantissant la disponibilité du dashboard même sans infrastructure de monitoring.

#### PipelineService

Récupère les runs GitHub Actions via `GET /repos/{owner}/{name}/actions/runs` et normalise les données :
- **Statut** : completed / running / pending
- **Durée** : calculée via Carbon (started_at → updated_at)
- **Fallback** : 4 pipelines mockés si aucun token ou erreur API

### 6.5 Endpoint Prometheus

Le `MetricsController` expose un endpoint public `/api/v1/metrics` au format texte Prometheus :

```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total 12345

# HELP database_connections_active Active database connections
# TYPE database_connections_active gauge
database_connections_active 5

# HELP cache_hit_rate Cache hit rate percentage
# TYPE cache_hit_rate gauge
cache_hit_rate 87.5

# HELP active_users Number of active users
# TYPE active_users gauge
active_users 42

# HELP total_favorites Total number of favorites
# TYPE total_favorites gauge
total_favorites 156

# HELP total_issue_views Total number of issue views
# TYPE total_issue_views gauge
total_issue_views 892

# HELP process_memory_usage_bytes Process memory usage in bytes
# TYPE process_memory_usage_bytes gauge
process_memory_usage_bytes 67108864

# HELP process_cpu_usage Process CPU usage percentage
# TYPE process_cpu_usage gauge
process_cpu_usage 12.5
```

Ce endpoint est scrapé par Prometheus toutes les 15 secondes (configuré dans `docker/prometheus/prometheus.yml`).

### 6.6 Frontend — Design System et UX

#### Design system TailwindCSS

Une palette de couleurs personnalisée est définie dans `tailwind.config.js` :

| Couleur | Usage | Nuances |
|---|---|---|
| `primary` (indigo) | Actions principales, liens | 50–950 |
| `secondary` (violet) | Accents, dégradés | 50–950 |
| `success` | États positifs | 50–950 |
| `warning` | Alertes modérées | 50–950 |
| `danger` | Erreurs, suppressions | 50–950 |
| `dark` | Texte, fonds sombres | 50–950 |

Typographie : **Inter** pour le texte, **JetBrains Mono** pour le code.

#### Animations CSS

Des keyframes personnalisées sont définies et intégrées à Tailwind :

| Animation | Usage |
|---|---|
| `fade-in` | Apparition des IssueCards |
| `slide-up` | Hero section de la HomePage |
| `slide-down` | Menu mobile (MobileNav) |
| `scale-in` | Badges, FavoriteButton |
| `pulse-slow` | Indicateurs de statut |

#### Accessibilité (WCAG 2.1 AA)

- **Attributs ARIA** : `aria-label`, `role`, `aria-pressed` sur tous les éléments interactifs.
- **Navigation clavier** : focus visible (`focus:ring-2`) sur tous les éléments interactifs.
- **Contraste** : palette de couleurs respectant les ratios de contraste WCAG AA.
- **Structure sémantique** : utilisation correcte des balises HTML5 (`<nav>`, `<main>`, `<section>`, `<article>`).

#### Responsive design

| Breakpoint | Comportement |
|---|---|
| Mobile (< 640px) | Menu hamburger, grilles 1 colonne, padding réduit |
| Tablette (640–768px) | Grilles 2 colonnes, navigation desktop commence |
| Desktop (≥ 768px) | Navigation horizontale, grilles 3–4 colonnes |
| Large (≥ 1024px) | Conteneur max-w-6xl, grilles 4 colonnes DevOps |

---

## 7. Tests et validation

### 7.1 Stratégie de test

Les tests sont implémentés avec **PHPUnit 12.5** (intégré à Laravel) et utilisent :
- `RefreshDatabase` : isolation des tests (base SQLite en mémoire pour la CI).
- `Http::fake()` : mock des réponses de l'API GitHub.
- `Sanctum::actingAs()` : authentification simulée pour les tests protégés.

### 7.2 Tests implémentés

#### AuthTest (5 tests)

| Test | Description | Assertions clés |
|---|---|---|
| `test_user_can_login_with_valid_credentials` | Connexion avec email/mot de passe valide | `assertOk()`, structure JSON `{message, token, user}` |
| `test_login_fails_with_invalid_credentials` | Connexion avec mauvais mot de passe | `assertUnprocessable()`, message d'erreur |
| `test_authenticated_user_can_access_profile` | Accès au profil avec token Sanctum | `assertOk()`, email correct |
| `test_non_admin_cannot_access_devops_routes` | Non-admin accédant aux routes DevOps | `assertForbidden()` |
| `test_admin_can_access_devops_routes` | Admin accédant aux routes DevOps | `assertOk()`, `status: success` |

#### IssueTest (6 tests)

| Test | Description | Assertions clés |
|---|---|---|
| `test_api_issues_endpoint_returns_success` | Recherche globale d'issues | Structure JSON, `difficulty: beginner` |
| `test_api_issues_returns_502_when_github_fails` | Gestion d'erreur API GitHub (500) | `assertStatus(502)`, message d'erreur |
| `test_repository_issues_endpoint_returns_formatted_data` | Issues d'un dépôt spécifique | Structure JSON complète (author, comments_count) |
| `test_repository_issues_excludes_pull_requests` | Filtrage des PRs déguisées en issues | `assertJsonCount(1, 'data')` |
| `test_repository_issues_returns_404_when_repo_not_found` | Dépôt inexistant | `assertStatus(404)` |
| `test_repository_issues_returns_429_on_rate_limit` | Rate limit dépassé | `assertStatus(429)`, message spécifique |

### 7.3 Exécution des tests

```bash
cd backend && php artisan test
```

Résultat : **11 tests, 11 assertions** — exécutés en SQLite en mémoire dans la CI GitHub Actions.

### 7.4 Couverture fonctionnelle

Les tests couvrent :
- ✅ Authentification (succès, échec, profil, RBAC admin/non-admin)
- ✅ Recherche d'issues (succès, erreur, pagination)
- ✅ Issues par dépôt (succès, 404, 429, filtrage PR)
- ✅ Classification de difficulté (beginner via `good first issue`)

**Limites identifiées** : pas de tests pour les favoris, l'historique, le profil, les métriques Prometheus, ni les services DevOps. L'ajout de ces tests constitue un axe d'amélioration (cf. section 10).

---

## 8. Déploiement et chaîne DevSecOps

### 8.1 Conteneurisation Docker

#### Architecture des conteneurs (docker-compose.yml)

| Service | Image / Build | Port | Rôle |
|---|---|---|---|
| `postgres` | postgres:16 | 5432 | Base de données |
| `backend` | ./backend (PHP 8.3-cli) | 8000 | API Laravel |
| `frontend` | ./frontend (node:24 → nginx:alpine) | 5173→80 | SPA React servie par nginx |
| `prometheus` | prom/prometheus:latest | 9090 | Collecte de métriques |
| `grafana` | grafana/grafana:latest | 3000 | Visualisation |
| `redis` | redis:7-alpine | 6379 | Cache distribué |

#### Configuration production (docker-compose.prod.yml)

La configuration production ajoute :
- **Healthchecks** sur chaque service (`pg_isready`, `redis-cli ping`, `php-fpm -t`, `wget --spider`).
- **Dépendances conditionnelles** (`depends_on` avec `condition: service_healthy`).
- **Ports de monitoring liés à 127.0.0.1** (non exposés publiquement).
- **Volumes persistants** pour PostgreSQL, Redis, Prometheus et Grafana.
- **Stratégie de redémarrage** `unless-stopped` sur tous les services.
- **Multi-stage Dockerfile** pour le backend (composer install → php:8.3-fpm-alpine + nginx + supervisord).
- **nginx** sert le frontend en production et reverse-proxy les requêtes `/api/` vers le backend.

### 8.2 Pipeline CI/CD (GitHub Actions)

Le pipeline `.github/workflows/ci-cd.yml` se déclenche sur push et pull request vers `main` et comprend trois jobs :

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────┐
│  build-backend   │────►│  build-frontend  │────►│    deploy    │
│                  │     │                   │     │ (conditionnel)│
│ • PHP 8.3 setup │     │ • Node 20 setup   │     │              │
│ • composer      │     │ • npm ci          │     │ Si main +    │
│   install       │     │ • npm run lint    │     │ ENABLE_DEPLOY│
│ • php artisan   │     │ • npm run build   │     │   = true     │
│   test          │     │ • upload artifact │     │              │
└─────────────────┘     └──────────────────┘     │ • Vercel CLI │
                                                  │   deploy     │
                                                  │ • Health     │
                                                  │   check      │
                                                  │ • Auto-      │
                                                  │   rollback    │
                                                  │ • Render hook│
                                                  └──────────────┘
```

#### Job 1 : build-backend
- Setup PHP 8.3 (action `shivammathur/setup-php@v2`).
- `composer install` (optimisé, sans dev).
- `php artisan test --no-coverage` (SQLite en mémoire).

#### Job 2 : build-frontend (dépend de build-backend)
- Setup Node 20.
- `npm ci` (installation déterministe depuis lockfile).
- `npm run lint` (ESLint).
- `npm run build` (Vite, avec `VITE_API_URL` pointant vers Render).
- Upload de `frontend/dist` comme artifact.

#### Job 3 : deploy (conditionnel)
**Condition** : `github.ref == 'refs/heads/main' && github.event_name == 'push' && vars.ENABLE_DEPLOY == 'true'`

Étapes :
1. Téléchargement de l'artifact `frontend-dist`.
2. Installation et exécution de **Vercel CLI** : `vercel deploy --prod --token=$VERCEL_TOKEN --yes`.
3. **Health check** : vérification du code HTTP de l'URL de production.
4. **Auto-rollback** : si le health check échoue (≥ 400), recherche du dernier déploiement `READY` et `vercel promote` pour revenir en arrière.
5. **Déploiement backend** : déclenchement via webhook Render (`RENDER_DEPLOY_HOOK`).

### 8.3 Stratégie de déploiement cloud

| Composant | Plateforme | Plan | URL |
|---|---|---|---|
| Frontend | Vercel | Free | https://opensourcematcher.vercel.app |
| Backend | Render | Free | https://opensourcematcher.onrender.com |
| Base de données | Render PostgreSQL | Free | — |
| Cache/Queue | Render Redis | Free | — |

**Configuration** (`render.yaml`) :
- Le backend utilise `php artisan serve` sur le port dynamique `$PORT` fourni par Render.
- Les variables d'environnement DB et Redis sont injectées via `fromDatabase`/`fromRedis`.
- Les secrets sensibles (GITHUB_TOKEN, OAuth) sont marqués `sync: false` (configuration manuelle).

### 8.4 Procédures de rollback

| Plateforme | Procédure |
|---|---|
| **Vercel** | Dashboard → Deployments → sélectionner un déploiement précédent → "Promote to Production" |
| **Render** | Dashboard → Deploys → "Restore Deploy" |
| **Base de données** | `php artisan migrate:rollback --step=1` ou restauration de sauvegarde Supabase |

L'auto-rollback Vercel dans le pipeline CI/CD permet de réagir automatiquement à un déploiement défectueux sans intervention manuelle.

---

## 9. Monitoring et observabilité

### 9.1 Architecture de monitoring

```
┌─────────────────────────────────────────────────────┐
│                    GRAFANA (:3000)                    │
│            Dashboards + Alerting + UI                  │
└──────────────────────┬──────────────────────────────┘
                       │ datasource (Prometheus)
┌──────────────────────▼──────────────────────────────┐
│                 PROMETHEUS (:9090)                    │
│   Stockage TSDB · PromQL · Règles d'alertes           │
└──────────────────────┬──────────────────────────────┘
                       │ scrape (15s)
┌──────────────────────▼──────────────────────────────┐
│              BACKEND LARAVEL (:8000)                  │
│           Endpoint /api/v1/metrics                   │
│    (http_requests_total, db_connections,             │
│     cache_hit_rate, active_users, memory,            │
│     cpu, favorites, issue_views)                     │
└─────────────────────────────────────────────────────┘
```

### 9.2 Métriques collectées

| Métrique | Type | Description |
|---|---|---|
| `http_requests_total` | counter | Nombre total de requêtes HTTP |
| `database_connections_active` | gauge | Connexions PostgreSQL actives (`pg_stat_activity`) |
| `cache_hit_rate` | gauge | Taux de succès du cache (%) |
| `active_users` | gauge | Utilisateurs actifs |
| `total_favorites` | gauge | Nombre total de favoris |
| `total_issue_views` | gauge | Nombre total de vues d'issues |
| `process_memory_usage_bytes` | gauge | Utilisation mémoire du process (bytes) |
| `process_cpu_usage` | gauge | Utilisation CPU (%) |

### 9.3 Règles d'alertes Prometheus

Des règles d'alertes sont définies dans `docker/prometheus/alert_rules.yml` avec deux niveaux de sévérité (warning / critical) et des annotations en français :

| Alerte | Condition (warning) | Condition (critical) |
|---|---|---|
| HighCPUUsage | CPU > 80% sur 5 min | CPU > 90% sur 2 min |
| HighMemoryUsage | RAM > 12 GB sur 5 min | RAM > 14 GB sur 2 min |
| HighResponseTime | Latence > 1s sur 5 min | Latence > 2s sur 2 min |
| HighDatabaseConnections | Connexions > 80 sur 5 min | Connexions > 90 sur 2 min |
| ServiceDown | — | `up == 0` pendant 1 min |
| DiskUsage | Disque > 80% sur 5 min | Disque > 90% sur 2 min |

### 9.4 Dashboard Grafana

Un dashboard pré-configuré (`docker/grafana/dashboards/laravel-metrics.json`) est provisionné automatiquement via le mécanisme de provisioning Grafana. Il inclut :
- Un datasource Prometheus configuré automatiquement.
- Des graphiques interactifs pour les métriques Laravel.
- Des seuils visuels (vert/jaune/rouge) basés sur les thresholds définis.

### 9.5 Tolérance aux pannes (graceful degradation)

Un principe clé du monitoring est la **dégradation gracieuse** : si Prometheus est indisponible ou non configuré, le `MonitoringService` bascule sur des données simulées. Cela garantit que le DevOps Dashboard reste fonctionnel même sans l'infrastructure de monitoring complète — un compromis pragmatique entre fiabilité et exhaustivité.

---

## 10. Discussion critique et axes d'amélioration

Cette section présente une analyse critique du projet, incluant les problèmes identifiés et les pistes d'évolution.

### 10.1 Problèmes identifiés

#### 10.1.1 Exposition de secrets en clair (SÉCURITÉ — Critique)

Le fichier `.env.prod.example` contient des **credentials réels** au lieu de valeurs de substitution :
- Mot de passe de la base de données Render PostgreSQL.
- Secret OAuth GitHub (`GITHUB_CLIENT_SECRET`).
- Clé d'application Laravel (`APP_KEY`).

**Impact** : quiconque accède au dépôt peut se connecter à la base de données de production et usurper l'identité OAuth.

**Recommandation** :
1. **Rotation immédiate** de toutes les credentials exposées (DB password, GitHub OAuth secret, APP_KEY).
2. Remplacement du contenu par des placeholders (`DB_PASSWORD=your-password-here`).
3. Ajout de `.env.prod.example` au `.gitignore` ou utilisation d'un système de secrets (GitHub Secrets, Vault).

#### 10.1.2 Fichiers Docker corrompus (INFRASTRUCTURE — Élevé)

Plusieurs fichiers de configuration Docker contiennent du texte de wrapper PowerShell (commande `Set-Content` au lieu du contenu attendu) :
- `backend/Dockerfile.prod`
- `docker/nginx.conf`
- `docker/nginx-frontend.conf`
- `docker/supervisord.conf`
- `docker/grafana/provisioning/dashboards/dashboard.yml`

**Cause probable** : les fichiers ont été créés via des commandes PowerShell here-string (`@'...'@ | Set-Content`), mais le wrapper n'a pas été retiré.

**Impact** : le build Docker en production échouera. Le contenu attendu est visible à l'intérieur des here-strings mais le format est invalide.

**Recommandation** : nettoyer chaque fichier en retirant le wrapper `@'` ... `'@ | Set-Content ...` et en ne conservant que le contenu entre les délimiteurs.

#### 10.1.3 Incohérence de clé localStorage (BUG — Moyen)

Le service API partagé (`services/api.js`) stocke le token d'authentification sous la clé `osm_token`, tandis que le service DevOps (`services/devops/devopsService.js`) le lit sous la clé `token`. De plus, `devopsService.js` contourne l'instance Axios partagée et son intercepteur.

**Impact** : les appels API DevOps envoient `Authorization: Bearer null`, provoquant des erreurs 401 sur le dashboard admin.

**Recommandation** : unifier `devopsService.js` pour utiliser l'instance Axios partagée (ou au minimum lire `osm_token`).

#### 10.1.4 Provisioning Grafana incomplet (INFRASTRUCTURE — Moyen)

Dans `docker-compose.prod.yml`, le répertoire `docker/grafana/dashboards/` (contenant `laravel-metrics.json`) n'est pas monté dans le conteneur Grafana. Seul `provisioning/` est monté. De plus, deux fichiers de configuration de provider en conflit existent (`dashboard.yml` corrompu et `dashboards.yml` avec un chemin différent).

**Impact** : les dashboards Grafana ne se chargent pas en production.

**Recommandation** : monter `docker/grafana/dashboards/` dans `/var/lib/grafana/dashboards/` et supprimer le fichier `dashboard.yml` corrompu.

#### 10.1.5 Duplication de Dockerfiles (QUALITÉ — Faible)

Les fichiers `backend/Dockerfile` et `backend/Dockerfile.render` sont identiques. Cette duplication peut entraîner des divergences futures.

**Recommandation** : supprimer le doublon ou utiliser un `ARG` pour gérer les différences (port, commande).

### 10.2 Axes d'amélioration fonctionnels

| Axe | Description | Priorité |
|---|---|---|
| Thème sombre/clair | Implémentation d'un toggle de thème | Moyenne |
| Notifications toast | Retour utilisateur sur actions (ajout favori, erreur) | Moyenne |
| Recherche avancée | Filtres additionnels (labels multiples, nombre de commentaires, date) | Basse |
| Mode hors-ligne | PWA avec cache service worker | Basse |
| Notifications push | Alerte quand une issue correspondant aux critères est créée | Basse |
| Internationalisation | Support multi-langue (i18n) | Basse |

### 10.3 Axes d'amélioration techniques

| Axe | Description | Priorité |
|---|---|---|
| Couverture de tests | Tests pour favoris, historique, profil, métriques, services DevOps | Haute |
| Tests E2E | Ajout de Cypress/Playwright pour les flux critiques (login, recherche, favori) | Haute |
| Analyse statique | PHPStan pour le backend, intégration dans la CI | Moyenne |
| Logging centralisé | Intégration d'ELK Stack ou Loki | Moyenne |
| Node Exporter | Métriques système complètes (au-delà du process Laravel) | Moyenne |
| Alertmanager | Notifications d'alertes (Slack, email) | Moyenne |
| CDN | Optimisation de la livraison des assets frontend | Basse |
| Scaling horizontal | Load balancer + multiples instances backend | Basse |

### 10.4 Retour d'expérience

Ce projet a permis de mettre en pratique de nombreux concepts abordés durant le cycle :

- **Architecture logicielle** : séparation des responsabilités, pattern Service, API REST versionnée.
- **DevOps** : conteneurisation, CI/CD, monitoring, déploiement cloud.
- **Sécurité** : OAuth, tokens, middleware RBAC, gestion des secrets (avec les leçons apprises de l'incident exposé en 10.1.1).
- **UX/UI** : design system, accessibilité, responsive design, animations.
- **Intégration d'API tierce** : gestion du rate limit, retry, cache, gestion d'erreurs.

Le principal enseignement est l'importance de la **défense en profondeur** : aucune couche ne doit être négligée, de l'écriture du code jusqu'à la gestion des secrets en passant par la configuration de l'infrastructure. L'incident de fuite de credentials (10.1.1) illustre comment une erreur apparemment mineure (un fichier d'exemple mal rédigé) peut compromettre l'ensemble du système.

---

## 11. Conclusion

Le projet **OpenSource Matcher v2** atteint les objectifs fixés en matière de fonctionnalité et d'architecture. La plateforme permet effectivement de rechercher, filtrer et sauvegarder des issues open-source GitHub, le tout dans une infrastructure conteneurisée, monitorée et déployée automatiquement.

**Bilan technique** :

| Aspect | État | Commentaire |
|---|---|---|
| Fonctionnalités cœur | ✅ Réalisé | Recherche, filtres, favoris, historique, auth OAuth |
| DevOps Dashboard | ✅ Réalisé | Health, monitoring, pipelines, deployments |
| Conteneurisation | ✅ Réalisé | 6 services Docker, healthchecks, volumes |
| CI/CD | ✅ Réalisé | GitHub Actions, auto-rollback, déploiement Vercel+Render |
| Monitoring | ✅ Réalisé | Prometheus + Grafana + alertes + fallback |
| Tests | ⚠️ Partiel | 11 tests couvrant l'auth et la recherche d'issues |
| Sécurité | ⚠️ Partiel | OAuth + Sanctum + RBAC, mais fuite de secrets à corriger |
| Accessibilité | ✅ Réalisé | WCAG 2.1 AA, ARIA, navigation clavier |
| Responsive | ✅ Réalisé | Mobile, tablette, desktop |

**Perspectives** : les axes d'amélioration identifiés (couverture de tests, correction des secrets, logging centralisé) constituent les priorités pour une mise en production robuste. L'architecture modulaire du projet facilite l'ajout de nouvelles fonctionnalités sans refactoring majeur.

Ce projet démontre la capacité à concevoir et réaliser une application web full-stack complète, de la base de données au déploiement cloud, en passant par l'authentification, l'intégration d'API tierces, et l'observabilité — des compétences essentielles pour un développeur moderne.

---

## 12. Webographie

### Documentation officielle

| Ressource | URL |
|---|---|
| Laravel 13 Documentation | https://laravel.com/docs |
| Laravel Sanctum | https://laravel.com/docs/sanctum |
| Laravel Socialite | https://laravel.com/docs/socialite |
| React 19 Documentation | https://react.dev |
| React Router 7 | https://reactrouter.com |
| Vite 6 | https://vitejs.dev |
| TailwindCSS 3.4 | https://tailwindcss.com/docs |
| PostgreSQL 16 | https://www.postgresql.org/docs/16/ |
| Docker Documentation | https://docs.docker.com |
| Docker Compose | https://docs.docker.com/compose/ |

### API et intégrations

| Ressource | URL |
|---|---|
| GitHub REST API | https://docs.github.com/en/rest |
| GitHub Search API (issues) | https://docs.github.com/en/rest/search#search-issues-and-pull-requests |
| GitHub Actions Documentation | https://docs.github.com/en/actions |
| GitHub OAuth Apps | https://docs.github.com/en/developers/apps/building-oauth-apps |
| Google OAuth 2.0 | https://developers.google.com/identity/protocols/oauth2 |

### DevOps et monitoring

| Ressource | URL |
|---|---|
| Prometheus Documentation | https://prometheus.io/docs |
| Grafana Documentation | https://grafana.com/docs |
| Render Documentation | https://render.com/docs |
| Vercel Documentation | https://vercel.com/docs |

### Standards et accessibilité

| Ressource | URL |
|---|---|
| WCAG 2.1 Guidelines | https://www.w3.org/TR/WCAG21 |
| OWASP Top 10 | https://owasp.org/www-project-top-ten |

---

## 13. Annexes

### Annexe A — Structure du dépôt

```
opensourcematcher v2/
├── backend/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Api/
│   │   │   │   │   ├── Auth/
│   │   │   │   │   │   ├── AuthController.php
│   │   │   │   │   │   └── SocialAuthController.php
│   │   │   │   │   ├── DevOps/
│   │   │   │   │   │   ├── DashboardController.php
│   │   │   │   │   │   ├── HealthController.php
│   │   │   │   │   │   ├── PipelineController.php
│   │   │   │   │   │   ├── DeploymentController.php
│   │   │   │   │   │   └── MonitoringController.php
│   │   │   │   │   ├── IssueController.php
│   │   │   │   │   ├── FavoriteController.php
│   │   │   │   │   ├── IssueViewController.php
│   │   │   │   │   ├── ProfileController.php
│   │   │   │   │   ├── MetricsController.php
│   │   │   │   │   └── DemoController.php
│   │   │   │   ├── Middleware/
│   │   │   │   │   └── AdminMiddleware.php
│   │   │   │   ├── Requests/
│   │   │   │   │   ├── LoginRequest.php
│   │   │   │   │   └── UpdateProfileRequest.php
│   │   │   │   └── Resources/
│   │   │   │       ├── UserResource.php
│   │   │   │       ├── FavoriteResource.php
│   │   │   │       └── IssueResource.php
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── Favorite.php
│   │   │   ├── Issue.php
│   │   │   └── IssueView.php
│   │   └── Services/
│   │       ├── GitHubService.php
│   │       ├── GitHubApiException.php
│   │       └── DevOps/
│   │           ├── MonitoringService.php
│   │           ├── HealthCheckService.php
│   │           ├── PipelineService.php
│   │           ├── DeploymentService.php
│   │           ├── PrometheusService.php
│   │           └── GrafanaService.php
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   │   ├── DatabaseSeeder.php
│   │   │   └── AdminSeeder.php
│   │   └── factories/
│   │       └── UserFactory.php
│   ├── routes/
│   │   ├── api.php
│   │   ├── web.php
│   │   └── console.php
│   ├── tests/
│   │   ├── Feature/
│   │   │   ├── AuthTest.php
│   │   │   ├── IssueTest.php
│   │   │   └── ExampleTest.php
│   │   └── Unit/
│   │       └── ExampleTest.php
│   ├── config/
│   ├── composer.json
│   ├── phpunit.xml
│   ├── Dockerfile
│   ├── Dockerfile.prod
│   └── Dockerfile.render
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── devops/
│   │   │   │   ├── DevOpsNav.jsx
│   │   │   │   ├── StatusCard.jsx
│   │   │   │   ├── MetricCard.jsx
│   │   │   │   ├── PipelineTable.jsx
│   │   │   │   ├── DeploymentTable.jsx
│   │   │   │   └── HealthTable.jsx
│   │   │   ├── IssueCard.jsx
│   │   │   ├── FavoriteButton.jsx
│   │   │   ├── FavoritesList.jsx
│   │   │   ├── MobileNav.jsx
│   │   │   ├── PopularRepositoriesGrid.jsx
│   │   │   ├── RepositorySelectorCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── SocialLoginButtons.jsx
│   │   ├── pages/
│   │   │   ├── devops/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Monitoring.jsx
│   │   │   │   ├── Pipelines.jsx
│   │   │   │   ├── Deployments.jsx
│   │   │   │   ├── SystemHealth.jsx
│   │   │   │   └── AdministrationHome.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── AuthCallbackPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── IssuesExplorerPage.jsx
│   │   │   ├── FavoritesPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── DemoPage.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── FavoritesContext.jsx
│   │   ├── hooks/
│   │   │   └── useIssueHistory.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── devops/
│   │   │       └── devopsService.js
│   │   ├── config/
│   │   │   └── github.js
│   │   ├── utils/
│   │   │   ├── auth.js
│   │   │   └── issue.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── App.css
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── Dockerfile
│   ├── Dockerfile.prod
│   └── vercel.json
├── docker/
│   ├── prometheus/
│   │   ├── prometheus.yml
│   │   └── alert_rules.yml
│   └── grafana/
│       ├── provisioning/
│       │   ├── datasources/
│       │   │   └── prometheus.yml
│       │   └── dashboards/
│       │       ├── dashboard.yml
│       │       └── dashboards.yml
│       └── dashboards/
│           └── laravel-metrics.json
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── docs/
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── DEPLOYMENT_INFO_SHEET.md
│   ├── DEPLOYMENT_TIMELINE.md
│   ├── DEVOPS_DASHBOARD.md
│   ├── FIXES_APPLIED.md
│   ├── GITHUB_ACTIONS_SETUP.md
│   └── README.md
├── docker-compose.yml
├── docker-compose.prod.yml
├── render.yaml
├── vercel.json
├── .env.prod.example
├── IMPROVEMENTS.md
└── README.md
```

### Annexe B — Variables d'environnement

#### Backend (`backend/.env`)

| Variable | Description | Exemple |
|---|---|---|
| `APP_NAME` | Nom de l'application | OpenSource Matcher API |
| `APP_ENV` | Environnement | local / production |
| `APP_KEY` | Clé de chiffrement | base64:... |
| `APP_ADMIN_PASSWORD` | Mot de passe admin seedé | password |
| `DB_CONNECTION` | Driver DB | pgsql |
| `DB_HOST` / `DB_PORT` | Hôte / port DB | 127.0.0.1 / 5432 |
| `GITHUB_TOKEN` | Token API GitHub | ghp_... |
| `GITHUB_CLIENT_ID` | OAuth GitHub | Ov23li... |
| `GITHUB_CLIENT_SECRET` | OAuth GitHub | ... |
| `GOOGLE_CLIENT_ID` | OAuth Google | ... |
| `GOOGLE_CLIENT_SECRET` | OAuth Google | ... |
| `FRONTEND_URL` | URL frontend (OAuth redirect) | http://localhost:5173 |
| `PROMETHEUS_URL` | URL Prometheus | http://prometheus:9090 |
| `GRAFANA_URL` | URL Grafana | http://grafana:3000 |
| `DOCKER_HOST` | Socket Docker | unix:///var/run/docker.sock |

#### Frontend (`frontend/.env`)

| Variable | Description | Exemple |
|---|---|---|
| `VITE_API_URL` | URL de l'API backend | http://localhost:8000/api/v1 |
| `VITE_GITHUB_REPO_OWNER` | Propriétaire du dépôt (pipelines) | Anntoi |
| `VITE_GITHUB_REPO_NAME` | Nom du dépôt (pipelines) | OpenSourceMatcher |

### Annexe C — Commandes utiles

| Action | Commande |
|---|---|
| Tests backend | `cd backend && php artisan test` |
| Lint backend | `cd backend && ./vendor/bin/pint` |
| Lint frontend | `cd frontend && npm run lint` |
| Build frontend | `cd frontend && npm run build` |
| Migration DB | `cd backend && php artisan migrate` |
| Seeding DB | `cd backend && php artisan db:seed` |
| Refresh DB | `cd backend && php artisan migrate:fresh --seed` |
| Docker (dev) | `docker compose up --build` |
| Docker (prod) | `docker compose -f docker-compose.prod.yml up --build` |

---

*Fin du rapport*
