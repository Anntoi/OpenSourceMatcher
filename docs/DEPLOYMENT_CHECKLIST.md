# 🚀 DEPLOYMENT CHECKLIST - QUICK START

## PHASE 1: LOCAL PREP (20 min)
- [ ] `npm run build` ✓ (frontend)
- [ ] `php artisan test` ✓ (backend)
- [ ] `git push origin main` ✓

## PHASE 2: CREATE CREDENTIALS (50 min)

### GitHub
- [ ] Generate Personal Access Token (github.com/settings/tokens)
  ```
  Token: ghp_xxxxxxxxxxxx
  ```
- [ ] Create OAuth App (github.com/settings/developers)
  ```
  Client ID: xxxxx
  Client Secret: xxxxx
  Callback: https://YOUR_API.onrender.com/auth/github/callback
  ```

### Google
- [ ] Create OAuth Credentials (console.cloud.google.com)
  ```
  Client ID: xxxxx
  Client Secret: xxxxx
  Redirect URI: https://YOUR_API.onrender.com/auth/google/callback
  ```

### Vercel
- [ ] Get Personal Access Token (vercel.com/account/tokens)
  ```
  Token: xxxxxxxxxxxxx
  ```

### Render
- [ ] Get API Key (render.com → Account → API Keys)
  ```
  Key: rnd_xxxxxxxx
  ```

## PHASE 3: SUPABASE (15 min)
- [ ] Create Supabase Project
- [ ] Copy Connection String
- [ ] Extract DB credentials:
  - [ ] Host: db.xxxx.supabase.co
  - [ ] Port: 5432
  - [ ] Database: postgres
  - [ ] User: postgres
  - [ ] Password: xxxxxxxxx
- [ ] Test local connection: `php artisan tinker` → `DB::connection()->getPdo()`

## PHASE 4: RENDER BACKEND (30 min)

1. [ ] Create Web Service
   - Repository: OpenSourceMatcher
   - Root: `backend`
   - Runtime: Docker

2. [ ] Set Environment Variables:
   ```
   APP_ENV=production
   APP_DEBUG=false
   APP_KEY=base64:xxxxxxx (same as local)
   APP_URL=https://YOUR_API.onrender.com
   
   # Database (from Supabase)
   DB_CONNECTION=pgsql
   DB_HOST=db.xxxx.supabase.co
   DB_PORT=5432
   DB_DATABASE=postgres
   DB_USERNAME=postgres
   DB_PASSWORD=xxxxxxxxx
   
   # GitHub
   GITHUB_TOKEN=ghp_xxxxxxxxxxxx
   GITHUB_CLIENT_ID=xxxxx
   GITHUB_CLIENT_SECRET=xxxxx
   GITHUB_REDIRECT_URI=https://YOUR_API.onrender.com/auth/github/callback
   
   # Google
   GOOGLE_CLIENT_ID=xxxxx
   GOOGLE_CLIENT_SECRET=xxxxx
   GOOGLE_REDIRECT_URI=https://YOUR_API.onrender.com/auth/google/callback
   
   # Frontend
   FRONTEND_URL=https://opensourcematcher.vercel.app
   CORS_ALLOWED_ORIGINS=https://opensourcematcher.vercel.app
   SANCTUM_STATEFUL_DOMAINS=opensourcematcher.vercel.app
   
   APP_ADMIN_PASSWORD=StrongPassword123!@#
   ```

3. [ ] Auto-deploy enabled
4. [ ] Wait for deploy to finish (~15 min)
5. [ ] Test: `curl https://YOUR_API.onrender.com/api/v1/issues`

## PHASE 5: VERCEL FRONTEND (25 min)

1. [ ] Create Project (import GitHub repo)
2. [ ] Set Environment Variable:
   ```
   VITE_API_URL=https://YOUR_API.onrender.com/api/v1
   ```
3. [ ] Auto-deploy enabled
4. [ ] Wait for deploy to finish (~10 min)
5. [ ] Test: Open https://opensourcematcher.vercel.app

## PHASE 6: GITHUB ACTIONS (20 min)

1. [ ] Add Repository Secrets:
   - VERCEL_TOKEN (from step Phase 2)
   - VERCEL_PROJECT_ID (from Vercel Dashboard → Settings)
   - RENDER_API_KEY (from Phase 2)

2. [ ] Add Repository Variable:
   - ENABLE_DEPLOY = true

3. [ ] Test auto-deploy:
   ```bash
   echo "# Test" >> README.md
   git add .
   git commit -m "test: auto-deploy"
   git push origin main
   ```

4. [ ] Monitor: github.com/YOUR_USERNAME/OpenSourceMatcher/actions

## PHASE 7: DOMAINS (Optional) (20 min)

- [ ] Vercel: Add custom domain frontend
- [ ] Render: Add custom domain backend
- [ ] Update OAuth redirect URIs to use custom domains

## PHASE 8: FINAL TESTS (30 min)

### Security
- [ ] APP_DEBUG=false ✓
- [ ] APP_ENV=production ✓
- [ ] HTTPS enforced ✓
- [ ] Secrets not in repo ✓

### OAuth
- [ ] Test GitHub login flow
- [ ] Test Google login flow
- [ ] Test Dev login (admin@example.com)

### API
- [ ] GET /api/v1/issues (public)
- [ ] POST /api/v1/login (authenticate)
- [ ] GET /api/v1/me (protected)
- [ ] POST /api/v1/favorites (protected)

### Frontend
- [ ] Issues display
- [ ] Login flows work
- [ ] Favorites save/load
- [ ] DevTools Network tab shows requests to correct API

---

## 🎉 PRODUCTION LIVE!

Your application is now deployed and ready for users! 🚀

**URLs:**
- Frontend: https://opensourcematcher.vercel.app
- Backend API: https://YOUR_API.onrender.com
- Database: Supabase PostgreSQL

---

## 📝 WHEN TO PUSH AFTER INITIAL DEPLOY

After your first successful deploy, you can push code anytime:

```bash
# Make your changes locally
git add .
git commit -m "feat: Add new feature"
git push origin main

# GitHub Actions will:
# 1. Run tests
# 2. Build frontend
# 3. Deploy to Vercel (frontend)
# 4. Deploy to Render (backend)
```

This happens **automatically** - no manual deploy needed! 🤖

---

## 🚨 COMMON ISSUES

| Issue | Fix |
|-------|-----|
| 502 Backend Error | Check Render logs - verify DB_HOST and GITHUB_TOKEN |
| Blank Frontend | Check VITE_API_URL in Vercel env vars |
| OAuth login fails | Verify redirect URIs are HTTPS and match exactly |
| Auto-deploy doesn't work | Check ENABLE_DEPLOY=true and secrets are set |

---

**Estimated Total Time: 2-3 hours**
**Status: PRODUCTION READY ✅**
