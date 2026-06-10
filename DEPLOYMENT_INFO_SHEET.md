# 📋 DEPLOYMENT INFO SHEET

**Garder ce document ouvert pendant le déploiement!**

---

## STEP 1: GITHUB TOKEN

**URL:** https://github.com/settings/tokens?type=beta

```
Token Name: OpenSource Matcher API Token
Scopes: repo, issues
Token: ghp_________________________
Status: ✅ SAVED
```

---

## STEP 2: GITHUB OAUTH APP

**URL:** https://github.com/settings/developers

```
App Name: OpenSource Matcher
Client ID: ___________________
Client Secret: _______________
Callback URI: https://YOUR_API.onrender.com/auth/github/callback
Status: ✅ SAVED
```

---

## STEP 3: GOOGLE OAUTH

**URL:** https://console.cloud.google.com/

```
Project Name: OpenSource Matcher
Client ID: _____________________
Client Secret: _________________
Redirect URIs:
  - http://localhost:8000/auth/google/callback
  - https://YOUR_API.onrender.com/auth/google/callback
Status: ✅ SAVED
```

---

## STEP 4: VERCEL TOKEN

**URL:** https://vercel.com/account/tokens

```
Token Name: GitHub Actions Deploy
Token: ________________________
Status: ✅ SAVED
```

**Also get VERCEL_PROJECT_ID:**
1. Go to https://vercel.com/dashboard
2. Click your project "OpenSource Matcher"
3. Go to Settings
4. Copy Project ID

```
Project ID: prj________________
Status: ✅ SAVED
```

---

## STEP 5: RENDER API KEY

**URL:** https://dashboard.render.com/ → Account → API Keys

```
Key Name: GitHub Actions
API Key: rnd_________________
Status: ✅ SAVED
```

---

## STEP 6: SUPABASE DATABASE

**URL:** https://supabase.com/

```
Project Name: OpenSource Matcher
Region: Europe (Frankfurt, etc)
Database Password: ____________________
Status: ✅ PROJECT CREATED
```

Once project is ready, get connection string from **Settings → Database**:

```
Connection String:
postgresql://postgres:PASSWORD@HOST:5432/postgres

Extract these:
Host: db.xxxxxx.supabase.co
Port: 5432
Database: postgres
User: postgres
Password: ____________________
Status: ✅ SAVED
```

---

## STEP 7: RENDER BACKEND SERVICE

**URL:** https://dashboard.render.com/

```
Service Name: opensourcematcher-api
Repository: YourUsername/OpenSourceMatcher
Root Directory: backend
Runtime: Docker
Status: ✅ CREATED

Render URLs:
https://opensourcematcher-api.onrender.com
API URL: https://opensourcematcher-api.onrender.com/api/v1

Status: ✅ DEPLOYED
```

**Environment Variables Set:**
```
☑ APP_ENV=production
☑ APP_DEBUG=false
☑ APP_KEY=base64:xxxxxxx
☑ DB_CONNECTION, DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
☑ GITHUB_TOKEN, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
☑ GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
☑ FRONTEND_URL, CORS_ALLOWED_ORIGINS
☑ APP_ADMIN_PASSWORD
```

---

## STEP 8: VERCEL FRONTEND

**URL:** https://vercel.com/

```
Project Name: OpenSource Matcher
Repository: YourUsername/OpenSourceMatcher
Status: ✅ CREATED

Frontend URL: https://opensourcematcher.vercel.app
Status: ✅ DEPLOYED

Environment Variables:
☑ VITE_API_URL=https://opensourcematcher-api.onrender.com/api/v1
```

---

## STEP 9: GITHUB ACTIONS SECRETS

**URL:** github.com/YourUsername/OpenSourceMatcher/settings/secrets/actions

```
Secrets Set:
☑ VERCEL_TOKEN = [from Step 4]
☑ VERCEL_PROJECT_ID = [from Step 4]
☑ RENDER_API_KEY = [from Step 5]

Variables Set:
☑ ENABLE_DEPLOY = true
```

---

## FINAL PRODUCTION URLS

```
🌐 Frontend:      https://opensourcematcher.vercel.app
🔧 Backend API:   https://opensourcematcher-api.onrender.com
📊 Database:      Supabase PostgreSQL (managed)

Admin Login:
  Email: admin@example.com
  Password: [value of APP_ADMIN_PASSWORD]

OAuth Logins:
  - GitHub (via github.com)
  - Google (via google.com)
```

---

## TEST ENDPOINTS

Once deployed, test these in terminal:

```bash
# 1. Public endpoint
curl https://opensourcematcher-api.onrender.com/api/v1/issues

# 2. Login with admin account
TOKEN=$(curl -X POST https://opensourcematcher-api.onrender.com/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"PASSWORD"}' | jq '.token' -r)

echo $TOKEN

# 3. Get current user (protected)
curl https://opensourcematcher-api.onrender.com/api/v1/me \
  -H "Authorization: Bearer $TOKEN"

# 4. Get favorites (protected)
curl https://opensourcematcher-api.onrender.com/api/v1/favorites \
  -H "Authorization: Bearer $TOKEN"

# 5. Create favorite
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

---

## TROUBLESHOOTING COMMANDS

```bash
# Check Render backend logs (replace SERVICE_ID)
curl https://api.render.com/v1/services/XXXX/logs \
  -H "authorization: Bearer YOUR_RENDER_API_KEY"

# Check if frontend can reach backend
curl https://opensourcematcher.vercel.app
# Open DevTools (F12) → Network tab → look for requests to backend

# SSH to Render (if needed)
# https://render.com/docs/deploys#ssh

# Database query from backend container
# You can SSH and run: psql DATABASE_URL -c "SELECT COUNT(*) FROM issues"
```

---

## MONITORING DASHBOARD LINKS

```
🔵 Render Backend:    https://dashboard.render.com/
🟣 Vercel Frontend:   https://vercel.com/dashboard
🟢 Supabase DB:       https://app.supabase.com/
⚫ GitHub Repo:       https://github.com/YourUsername/OpenSourceMatcher
⚪ GitHub Actions:    https://github.com/YourUsername/OpenSourceMatcher/actions
```

---

## DAILY OPERATIONS

### Check Status
- Render: Dashboard → Service → Health
- Vercel: Dashboard → Project → Deployments
- Supabase: Dashboard → Database → Usage

### View Logs
- Render: Dashboard → Service → Logs
- Vercel: Click deployment → Logs
- Supabase: Query SQL Editor for errors

### Update Code
```bash
git add .
git commit -m "your change"
git push origin main
# → GitHub Actions runs automatically
# → Vercel + Render redeploy automatically
```

---

## 🎯 REMEMBER

- ✅ All secrets are in platform dashboards, NOT in git repo
- ✅ `.env` files are in `.gitignore` (won't be committed)
- ✅ Database backups are automatic (Supabase)
- ✅ HTTPS is automatic (Let's Encrypt via Render/Vercel)
- ✅ CI/CD is automatic (GitHub Actions)

**You deployed a production-ready application! 🚀**
