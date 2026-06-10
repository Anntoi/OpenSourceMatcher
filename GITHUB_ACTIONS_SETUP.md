# ⚙️ CONFIGURATION GITHUB ACTIONS - SECRETS & VARIABLES

## 🔑 SECRETS À CONFIGURER

**URL:** https://github.com/YourUsername/OpenSourceMatcher/settings/secrets/actions

### 1. VERCEL_TOKEN
```
Value: [Token from https://vercel.com/account/tokens]
Scope: Repository
```

### 2. VERCEL_ORG_ID ⚠️ NOUVEAU!
```
Value: [Get from Vercel Dashboard → Settings → General]
Scope: Repository
```

### 3. VERCEL_PROJECT_ID ⚠️ NOUVEAU!
```
Value: [Get from Vercel Dashboard → Settings → General]
Scope: Repository
```

### 4. RENDER_DEPLOY_HOOK ⚠️ NOUVEAU!
```
Value: [Get from Render Dashboard → your service → Trigger deploys]
Format: https://api.render.com/deploy/srv-xxxxxxxxxx?key=xxxxxxxxxxxxx
Scope: Repository
```

---

## 📊 VARIABLES À CONFIGURER

**URL:** https://github.com/YourUsername/OpenSourceMatcher/settings/variables/actions

### 1. ENABLE_DEPLOY
```
Value: true
Scope: Repository
(Mettre à false si tu veux arrêter les auto-deploys)
```

### 2. VITE_API_URL (Optionnel)
```
Value: https://opensourcematcher-api.onrender.com/api/v1
Scope: Repository
(Par défaut dans le workflow si vide)
```

---

## 📋 CHECKLIST SETUP

### Pour Render Deploy Hook:

1. Go to: https://dashboard.render.com/
2. Select your service (opensourcematcher-api)
3. Click "Settings" tab
4. Scroll to "Deploys"
5. Find section "Deploy" or "Trigger deploys"
6. Copy the webhook URL
7. Go to GitHub → Settings → Secrets → Add `RENDER_DEPLOY_HOOK`

### Pour Vercel IDs:

1. Go to: https://vercel.com/dashboard
2. Click on your project "OpenSource Matcher"
3. Click "Settings" → "General"
4. Find:
   - **ORG ID**: Under "Vercel for..."
   - **PROJECT ID**: Under "Project ID" field
5. Add both to GitHub Secrets

### Pour VERCEL_TOKEN:

1. Go to: https://vercel.com/account/tokens
2. Create new token → Name: "GitHub Actions"
3. Copy and add to GitHub Secrets

---

## ✅ APRÈS CONFIGURATION

Test avec:

```bash
# Commit un petit changement
echo "# Test CI/CD" >> README.md
git add .
git commit -m "test: verify CI/CD workflow"
git push origin main

# Vérifie: https://github.com/YourUsername/OpenSourceMatcher/actions
# Tous les jobs doivent réussir ✅
```

---

## 🐛 SI ÇA NE MARCHE PAS

| Error | Solution |
|-------|----------|
| "VERCEL_ORG_ID not found" | Go Vercel Dashboard → Settings → Copy correct ID |
| "Deploy hook failed" | Check RENDER_DEPLOY_HOOK is valid and webhook enabled |
| "Authentication failed" | Tokens expired? Regenerate and update secrets |
| "Frontend build fails" | Check VITE_API_URL is correct |

---

## 📝 SECRETS CONFIGURATION TEMPLATE

```yaml
GitHub Secrets:
- VERCEL_TOKEN = "ey..."
- VERCEL_ORG_ID = "team_..."
- VERCEL_PROJECT_ID = "prj_..."
- RENDER_DEPLOY_HOOK = "https://api.render.com/deploy/srv-...?key=..."

GitHub Variables:
- ENABLE_DEPLOY = "true"
- VITE_API_URL = "https://opensourcematcher-api.onrender.com/api/v1"
```

---

**Une fois configuré, le CI/CD fonctionne automatiquement à chaque push! 🚀**
