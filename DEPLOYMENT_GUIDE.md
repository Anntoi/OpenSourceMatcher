# 🚀 GUIDE DÉPLOIEMENT COMPLET - OPENSOURCE MATCHER

## ⏱️ TEMPS TOTAL: ~2-3 heures (incluant attentes)

---

# 📋 TABLE DES MATIÈRES
1. [PHASE 1: Préparation Locale](#phase-1-préparation-locale-20-min)
2. [PHASE 2: Services Externes](#phase-2-services-externes-50-min)
3. [PHASE 3: Database Supabase](#phase-3-database-supabase-15-min)
4. [PHASE 4: Backend Render](#phase-4-backend-render-30-min)
5. [PHASE 5: Frontend Vercel](#phase-5-frontend-vercel-25-min)
6. [PHASE 6: CI/CD GitHub Actions](#phase-6-cicd-github-actions-20-min)
7. [PHASE 7: Domains (Optional)](#phase-7-domains-optional-20-min)
8. [PHASE 8: Final Checks](#phase-8-final-checks-30-min)

---

# PHASE 1: Préparation Locale (20 min)

## ✅ Step 1: Créer `.env.production` Local

Crée un fichier pour tester la config de production:

```bash
cd backend
cp .env .env.production
```

Édite `.env.production` avec les valeurs que tu utiliseras en production:

```bash
APP_NAME="OpenSource Matcher API"
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:rS/Mq1ZWzgVUxV+gPnAsJ3ay6qebXlB/69RD+56C8Jo=
APP_URL=http://localhost:8000  # Sera changé plus tard

# Database - Tu utiliseras Supabase après
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=opensource_matcher
DB_USERNAME=postgres
DB_PASSWORD=postgres

# GitHub
GITHUB_TOKEN=ghp_xxxxxxxx  # À générer à la prochaine phase
GITHUB_REPO_OWNER=VotreUsername
GITHUB_REPO_NAME=OpenSourceMatcher
GITHUB_CLIENT_ID=xxxxx
GITHUB_CLIENT_SECRET=xxxxx
GITHUB_REDIRECT_URI=http://localhost:8000/auth/github/callback

# Google
GOOGLE_CLIENT_ID=xxxxx
GOOGLE_CLIENT_SECRET=xxxx
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback

# Frontend
FRONTEND_URL=http://localhost:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:5173

# Admin
APP_ADMIN_PASSWORD=StrongPasswordHere123!@#
```

---

## ✅ Step 2: Tester le Build Frontend Localement

```bash
cd frontend

# Install dependencies
npm install

# Test build
npm run build

# Vérifier que dist/ a été créé
ls -la dist/
```

**Résultat attendu:** Dossier `dist/` créé sans erreurs.

---

## ✅ Step 3: Tester les Tests Backend

```bash
cd backend

# Install composer deps si pas encore fait
composer install

# Run tests
php artisan test

# Attendu: 9 tests, 0 failures
```

**Résultat attendu:**
```
Tests:  9 passed
```

---

## ✅ Step 4: Commit & Push Initial sur GitHub

```bash
cd .. # (à la racine du projet)

# Vérifier que .env ne sera pas committés
cat .gitignore | grep ".env"

# Commit les changements (migrations, fixes, etc)
git add .
git commit -m "fix: Apply security and performance fixes

- Add token expiration (7 days)
- Add UserResource to prevent data leak
- Add database constraints and indexes
- Add rate limiting on login
- Add GitHub API timeout, retry, and cache
- Add AbortController to prevent memory leaks
- Add debounce on search filters
- Add 401 interceptor for token expiration

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

# Push vers GitHub
git push origin main
```

**Résultat attendu:** Changements pushés sur GitHub.

---

# PHASE 2: Services Externes (50 min)

## ✅ Step 5: GitHub Personal Access Token

**Pourquoi:** L'API GitHub a une limite de 60 req/heure sans token. Avec token = 5000 req/heure.

1. Aller à: https://github.com/settings/tokens?type=beta
2. Cliquer sur **"Generate new token"** (classic)
3. Donner un nom: `OpenSource Matcher API Token`
4. Sélectionner **scopes:**
   - `repo` (pour accéder aux public repos)
   - `issues` (pour lire les issues)
5. Générer et **copier le token** (tu ne pourras le voir qu'une fois!)

```
Token format: ghp_xxxxxxxxxxxxxxxxxxxxx
```

**Sauvegarde ce token en sécurité** (password manager, Bitwarden, etc.)

---

## ✅ Step 6: GitHub OAuth App

**Pourquoi:** Permet aux utilisateurs de se connecter via GitHub.

1. Aller à: https://github.com/settings/developers
2. Cliquer sur **OAuth Apps** → **New OAuth App**
3. Remplir le formulaire:

| Field | Value |
|-------|-------|
| Application name | OpenSource Matcher |
| Homepage URL | https://opensourcematcher.vercel.app |
| Authorization callback URL | https://api-yourname.onrender.com/auth/github/callback |

4. Après création, copier:
   - **Client ID**: (visible)
   - **Client Secret**: (Cliquer pour régénérer et copier)

```
Client ID: abc123xyz
Client Secret: ghp_xxxxxxxxxxxxxxxx
```

---

## ✅ Step 7: Google OAuth Credentials

**Pourquoi:** Alternative de connexion pour les utilisateurs.

1. Aller à: https://console.cloud.google.com/
2. Créer un nouveau projet: **OpenSource Matcher**
3. Dans **APIs & Services** → **Credentials**
4. Cliquer **Create Credentials** → **OAuth 2.0 Client ID**
5. Sélectionner **Web Application**
6. Ajouter les **Authorized redirect URIs:**
   ```
   http://localhost:8000/auth/google/callback
   https://api-yourname.onrender.com/auth/google/callback
   ```

7. Copier:
   - **Client ID**
   - **Client Secret**

---

## ✅ Step 8: Vercel Personal Access Token

**Pourquoi:** Pour GitHub Actions puisse deployer automatiquement sur Vercel.

1. Aller à: https://vercel.com/account/tokens
2. Cliquer **Create**
3. Donner un nom: `GitHub Actions Deploy`
4. Copier le token

```
Token format: xxxxxxxxxxxxxxxxxxxxx
```

---

## ✅ Step 9: Render API Key

**Pourquoi:** Pour GitHub Actions puisse deployer automatiquement sur Render.

1. Aller à: https://dashboard.render.com/
2. Cliquer sur ton **Account** (bottom left)
3. Cliquer **API Keys**
4. Cliquer **Create API Key**
5. Copier la clé

```
Key format: rnd_xxxxxxxxxxxxxxxxxxxxxxxx
```

---

# PHASE 3: Database Supabase (15 min)

## ✅ Step 10: Créer Projet Supabase

1. Aller à: https://supabase.com/
2. Cliquer **New project**
3. Remplir le formulaire:

| Field | Value |
|-------|-------|
| Project name | OpenSource Matcher |
| Database password | **Strong password! Save it!** |
| Region | Europe (closest to you) |

4. Attendre le déploiement (5-10 min)

---

## ✅ Step 11: Copier Connection String

Une fois le projet créé:

1. Aller dans **Settings** → **Database**
2. Copier la **Connection string** (JDBC format):

```
postgresql://postgres:PASSWORD@HOSTNAME:5432/postgres
```

À partir de cette string, extraire:
- **Host:** (la partie après @)
- **Port:** 5432
- **Database:** postgres
- **User:** postgres
- **Password:** (ce que tu as défini)

Transformer en format Laravel:
```
postgresql://user:password@hostname:5432/database
```

**Exemple complet:**
```
postgresql://postgres:MyStrongPassword123@db.abc123.supabase.co:5432/postgres
```

---

## ✅ Step 12: Tester Connection Localement

Ajouter temporairement à `.env`:

```bash
DB_CONNECTION=pgsql
DB_HOST=db.abc123.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=MyStrongPassword123
```

Tester la connexion:

```bash
cd backend
php artisan tinker

# Dans tinker:
DB::connection()->getPdo()
# Doit retourner une PDO object sans erreur

exit
```

Si succès: ✅ Connection OK

---

# PHASE 4: Backend Render (30 min)

## ✅ Step 13: Créer Service Render

1. Aller à: https://dashboard.render.com/
2. Cliquer **New +** → **Web Service**
3. Cliquer **Deploy an existing repository** → **Connect your GitHub**
4. Sélectionner le repo **OpenSourceMatcher**
5. Autoriser Render sur GitHub

Render va scanner ton repo. Attendre le scan.

---

## ✅ Step 14: Configurer Render Settings

Une fois le repo lié:

1. **Name:** `opensourcematcher-api`
2. **Branch:** `main`
3. **Root Directory:** `backend` (important!)
4. **Runtime:** Docker
5. **Build Command:** (laisser auto-detected)
6. **Start Command:** (laisser auto-detected)

Scroller vers bas et cliquer **Advanced** pour ajouter **Environment Variables:**

```
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:+7xUnQqGzhYmZ8yTUcf9QLWHc1tz09rX6S56lYPMwXM=
APP_URL=https://opensourcematcher-api.onrender.com
APP_ADMIN_PASSWORD=StrongPasswordHere123!@#

# Database (de Supabase)
DB_CONNECTION=pgsql
DB_HOST=db.abc123.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=MyStrongPassword123

# GitHub
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx
GITHUB_REPO_OWNER=YourUsername
GITHUB_REPO_NAME=OpenSourceMatcher
GITHUB_CLIENT_ID=xxxxx
GITHUB_CLIENT_SECRET=xxxxx
GITHUB_REDIRECT_URI=https://opensourcematcher-api.onrender.com/auth/github/callback

# Google
GOOGLE_CLIENT_ID=xxxxx
GOOGLE_CLIENT_SECRET=xxxxx
GOOGLE_REDIRECT_URI=https://opensourcematcher-api.onrender.com/auth/google/callback

# Frontend
FRONTEND_URL=https://opensourcematcher.vercel.app
CORS_ALLOWED_ORIGINS=https://opensourcematcher.vercel.app
SANCTUM_STATEFUL_DOMAINS=opensourcematcher.vercel.app

# Monitoring (optional)
PROMETHEUS_URL=
GRAFANA_URL=
GRAFANA_API_KEY=
DOCKER_HOST=
```

---

## ✅ Step 15: Lier le Repo à Render

Dans la section **Connect to GitHub:**

1. Vérifier le repo est bien sélectionné: `YourUsername/OpenSourceMatcher`
2. Vérifier **Auto-deploy** est activé (checkbox)

Cliquer **Create Web Service**

Render va maintenant:
1. Cloner le repo
2. Build l'image Docker
3. Déployer (peut prendre 15-20 minutes)

---

## ✅ Step 16: Tester le Backend Deploy

Une fois le deploy terminé:

1. Render te donne une URL: `https://opensourcematcher-api.onrender.com`
2. Tester les endpoints:

```bash
# Test issues endpoint
curl https://opensourcematcher-api.onrender.com/api/v1/issues

# Expected: JSON response avec issues

# Si Supabase connection OK:
curl https://opensourcematcher-api.onrender.com/api/v1/issues
# → Doit retourner des issues (si ton repo GitHub a des issues avec labels)
```

**Résultat attendu:**
```json
{
  "data": [],
  "meta": { "current_page": 1, "per_page": 10, "total": 0 }
}
```

Ou des issues si GitHub Token marche et que ton repo en a.

---

# PHASE 5: Frontend Vercel (25 min)

## ✅ Step 17: Créer Projet Vercel

1. Aller à: https://vercel.com/
2. Cliquer **New Project**
3. **Import Git Repository** → Sélectionner `OpenSourceMatcher`
4. Cliquer **Import**

---

## ✅ Step 18: Configurer Environment Variable

Une fois importé:

1. Aller dans **Settings** → **Environment Variables**
2. Ajouter nouvelle variable:

| Name | Value | Environments |
|------|-------|--------------|
| VITE_API_URL | https://opensourcematcher-api.onrender.com/api/v1 | Production, Preview |

3. Cliquer **Save**

---

## ✅ Step 19: Lier Repo & Auto-Deploy

Vercel le fait automatiquement! Mais vérifier:

1. **Git** → Connecté à GitHub ✓
2. **Branch** → `main` ✓
3. **Auto-deploy** → Activé ✓

---

## ✅ Step 20: Tester le Frontend Deploy

Vercel va déployer automatiquement après quelques minutes.

1. Tu reçois une URL: `https://opensourcematcher.vercel.app`
2. Ouvrir dans le navigateur
3. Vérifier que ça charge sans erreur
4. Ouvrir **DevTools (F12)** → **Network** → chercher une requête vers `/api/v1/issues`

**Résultat attendu:** Les issues s'affichent (ou "Aucune issue trouvée" si le GitHub Token n'a pas trouvé d'issues)

---

# PHASE 6: CI/CD GitHub Actions (20 min)

## ✅ Step 21: Ajouter Repository Secrets

Ces secrets sont pour GitHub Actions (auto-deploy).

1. Aller à ton repo GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Cliquer **New repository secret** pour chaque:

| Secret Name | Value |
|---|---|
| VERCEL_TOKEN | (Token créé à l'étape 8) |
| VERCEL_PROJECT_ID | (Voir Vercel dashboard → Settings → Project ID) |
| RENDER_API_KEY | (Clé créée à l'étape 9) |

**Comment trouver VERCEL_PROJECT_ID:**
1. Aller à https://vercel.com/dashboard
2. Cliquer sur ton projet OpenSource Matcher
3. **Settings** → Copier **Project ID**

---

## ✅ Step 22: Ajouter Repository Variables

1. **Settings** → **Secrets and variables** → **Actions**
2. Cliquer sur **Variables** tab
3. Cliquer **New repository variable**

| Variable Name | Value |
|---|---|
| ENABLE_DEPLOY | true |

---

## ✅ Step 23: Tester Auto-Deploy

Maintenant quand tu fais un push, GitHub Actions va:
1. Tester le backend (9 tests)
2. Tester le frontend (npm lint + build)
3. Si tout passe, déployer automatiquement

Pour tester:

```bash
# Faire un petit changement
echo "# Test deploy" >> README.md

git add .
git commit -m "test: Test GitHub Actions auto-deploy"
git push origin main
```

1. Aller à: https://github.com/YourUsername/OpenSourceMatcher/actions
2. Vérifier que le workflow démarre
3. Attendre que tout passe et que Vercel/Render reçoivent le déploiement

**Résultat attendu:**
```
✓ install backend
✓ test backend (9 tests passed)
✓ install frontend
✓ lint frontend
✓ build frontend
→ deploy to Vercel
→ deploy to Render
```

---

# PHASE 7: Domains (Optional) (20 min)

**Cette phase est optionnelle. Tu peux utiliser les URLs Render/Vercel par défaut.**

## ✅ Step 24: Custom Domain Vercel (Frontend)

Si tu as un domaine personnalisé (ex: opensourcematcher.com):

1. Aller à: https://vercel.com/dashboard
2. Sélectionner le projet
3. **Settings** → **Domains**
4. Ajouter ton domaine: `opensourcematcher.com`
5. Vercel te donne des **DNS records** à ajouter chez ton registrar
6. Ajouter les DNS records
7. Attendre la propagation (5-30 min)

---

## ✅ Step 25: Custom Domain Render (Backend)

Si tu as un sous-domaine (ex: api.opensourcematcher.com):

1. Aller à: https://dashboard.render.com/
2. Sélectionner ton service backend
3. **Settings** → **Redirects**
4. Ajouter le domaine: `api.opensourcematcher.com`
5. Render te donne un **CNAME record**
6. Ajouter le CNAME chez ton registrar
7. Attendre la propagation

**Après la propagation, mettre à jour :**
- Backend: `APP_URL`, `GITHUB_REDIRECT_URI`, `GOOGLE_REDIRECT_URI`
- Frontend: `VITE_API_URL`

---

# PHASE 8: Final Checks (30 min)

## ✅ Step 26: Tester OAuth Flows en Production

### Test GitHub OAuth

1. Aller à: https://opensourcematcher.vercel.app/login
2. Cliquer sur le bouton **GitHub**
3. Autoriser l'accès
4. Vérifier que tu es redirigé vers `/dashboard`
5. Vérifier que ton profil s'affiche

**Si erreur:**
- Vérifier `GITHUB_CLIENT_ID` et `GITHUB_CLIENT_SECRET` dans Render
- Vérifier que le `GITHUB_REDIRECT_URI` est correct (doit être HTTPS en production!)
- Logs: `https://dashboard.render.com/ → Select service → Logs`

### Test Google OAuth

Même processus avec le bouton Google.

### Test Dev Login

1. Cliquer "Connexion développeur" sur `/login`
2. Email: `admin@example.com`
3. Password: (valeur de `APP_ADMIN_PASSWORD` dans Render)

Si ça marche pas:
- Vérifier que `php artisan db:seed` a été exécuté sur Supabase
- Voir les logs Render pour les erreurs

---

## ✅ Step 27: Tester les API Endpoints

```bash
# 1. Test issues endpoint (publique)
curl https://opensourcematcher-api.onrender.com/api/v1/issues

# 2. Se connecter et obtenir un token
curl -X POST https://opensourcematcher-api.onrender.com/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# 3. Copier le token retourné
TOKEN="eyJ0eXAiOiJKV1QiLCJhbGc..."

# 4. Tester endpoint protégé
curl https://opensourcematcher-api.onrender.com/api/v1/me \
  -H "Authorization: Bearer $TOKEN"

# 5. Tester favoris
curl -X POST https://opensourcematcher-api.onrender.com/api/v1/favorites \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "issue_number": 1,
    "title": "Test Issue",
    "repository": "test/repo",
    "url": "https://github.com/test/repo/issues/1",
    "labels": [],
    "difficulty": "beginner"
  }'
```

**Résultat attendu:**
- /issues → JSON avec issues
- /login → JSON avec token
- /me → JSON avec user data
- /favorites → JSON avec favorite créé

---

## ✅ Step 28: Setup Monitoring (Optional)

Pour tracker les erreurs en production:

### Option 1: Sentry.io (Recommandé)

```bash
# 1. Créer compte sur https://sentry.io/
# 2. Créer nouveau projet Laravel
# 3. Copier le DSN

# 4. Ajouter à Render env vars:
SENTRY_LARAVEL_DSN=https://xxxxx@xxxxx.ingest.sentry.io/123456

# 5. Les erreurs vont automatiquement être trackées
```

### Option 2: Datadog

```bash
# 1. Créer compte Datadog
# 2. Ajouter variables d'env
DD_AGENT_HOST=localhost
DD_APM_ENABLED=true
```

---

# ✅ CHECKLIST FINAL PRODUCTION

```
SECURITY
☑cd APP_DEBUG=false
☑ APP_ENV=production
☑ Token expiration configuré (7 jours)
☑ HTTPS activé (auto sur Vercel/Render)
☑ CORS restricted (seulement frontend domain)
☑ Tous les tokens/secrets dans Render/Vercel (pas dans le repo)

DATABASE
☑ Supabase PostgreSQL créé
☑ Connection string configurée
☑ Migrations appliquées
☑ Seeders exécutés (admin account)
☑ Backups activés dans Supabase

BACKEND
☑ Render service créé et déploye
☑ Tous les env vars configurés
☑ GitHub Actions workflow OK
☑ API endpoints testés
☑ OAuth working en production

FRONTEND
☑ Vercel project créé et déploye
☑ VITE_API_URL pointant au bon backend
☑ Builds OK sans erreur
☑ UI loads correctly
☑ OAuth flows working

DOMAINS (optional)
☑ Custom domains configurés (si applicable)
☑ DNS records propagés
☑ OAuth redirect URIs updated

MONITORING
☑ Logs accessible (Render/Vercel)
☑ Sentry ou monitoring activé (optional)
☑ Uptime monitoring configuré (optional)
```

---

# 🎉 DÉPLOIEMENT COMPLET!

À ce stade, tu as:
- ✅ Backend production-ready sur Render
- ✅ Frontend production-ready sur Vercel
- ✅ Database production-ready sur Supabase
- ✅ CI/CD auto-deploy via GitHub Actions
- ✅ OAuth working (GitHub + Google)
- ✅ All security fixes applied

Ton site est live et accessible! 🚀

---

# 📞 TROUBLESHOOTING

## "API returns 502 Bad Gateway"

```bash
# Check Render logs:
1. Go to Render dashboard
2. Select your service
3. Click "Logs"
4. Look for error messages

# Common fixes:
- Check DATABASE_URL is correct
- Check GITHUB_TOKEN is valid
- Check PHP version compatibility
```

## "Frontend shows blank page"

```bash
# Open DevTools (F12)
# Go to Console tab
# Look for error messages

# Common fixes:
- Check VITE_API_URL environment variable
- Check CORS_ALLOWED_ORIGINS in Render backend
- Check that backend is responding to /api/v1/issues
```

## "OAuth login fails"

```bash
# Check in Render logs for OAuth errors
# Verify redirect URIs match exactly:
- GitHub: https://yourapi.onrender.com/auth/github/callback
- Google: https://yourapi.onrender.com/auth/google/callback

# Ensure client IDs/secrets are correct in Render env vars
```

## "Vercel build fails"

```bash
# Click on the failed deployment in Vercel
# Look at the "Build Logs" tab
# Most common: VITE_API_URL not set or invalid
```

---

**Total Time: ~2-3 hours**
**Status: READY FOR PRODUCTION ✅**
