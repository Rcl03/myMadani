# GitHub Deployment Guide for MyMadani

This guide covers deploying your app to GitHub Pages with automated CI/CD.

## Method 1: GitHub Pages with GitHub Actions (Recommended)

This method automatically builds and deploys your app whenever you push to GitHub.

### Step 1: Update Vite Configuration

Your `vite.config.ts` needs to know the base path for GitHub Pages. Update it based on your repository name:

- If repo is `username/mymadani` → base: `/mymadani/`
- If repo is `username/username.github.io` → base: `/`

### Step 2: Create GitHub Actions Workflow

A workflow file has been created at `.github/workflows/deploy.yml` that will:
- Build your app on every push to `main` branch
- Deploy to GitHub Pages automatically
- Use your `GEMINI_API_KEY` from GitHub Secrets

### Step 3: Set Up GitHub Repository

1. **Create a GitHub repository** (if you haven't already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Add GitHub Secret for API Key:**
   - Go to your repository on GitHub
   - Click **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `GEMINI_API_KEY`
   - Value: Your actual Gemini API key
   - Click **Add secret**

3. **Enable GitHub Pages:**
   - Go to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - Save

### Step 4: Push and Deploy

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push
```

The GitHub Action will automatically:
1. Build your app
2. Deploy to GitHub Pages
3. Your app will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

---

## Method 2: Manual GitHub Pages Deployment

If you prefer manual deployment:

### Step 1: Install gh-pages

```bash
npm install --save-dev gh-pages
```

### Step 2: Update package.json

Add these scripts (already added if you used the automated setup):

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME"
}
```

### Step 3: Update vite.config.ts

Add the base path:

```typescript
export default defineConfig({
  base: '/YOUR_REPO_NAME/',
  // ... rest of config
})
```

### Step 4: Deploy

```bash
npm run deploy
```

This will:
- Build your app
- Push the `dist` folder to the `gh-pages` branch
- GitHub Pages will serve from that branch

---

## Important Notes

### Environment Variables

Since GitHub Pages serves static files, you have two options for `GEMINI_API_KEY`:

**Option A: Use GitHub Actions (Recommended)**
- Store API key as GitHub Secret
- Build-time injection via workflow
- API key never exposed in code

**Option B: Client-side (Less Secure)**
- API key will be visible in browser
- Only use if you have API key restrictions set up in Google Cloud Console
- Add to `.env` file (but don't commit it!)

### Base Path Configuration

Your `vite.config.ts` needs the correct base path. The workflow file will handle this automatically, but if deploying manually:

```typescript
// For repository: username/mymadani
base: '/mymadani/'

// For user/organization page: username/username.github.io
base: '/'
```

### Custom Domain (Optional)

1. Create a `CNAME` file in `public/` folder:
   ```
   yourdomain.com
   ```

2. In GitHub repository:
   - Settings → Pages → Custom domain
   - Enter your domain
   - Follow DNS setup instructions

---

## Troubleshooting

**404 errors on routes:**
- GitHub Pages needs a `404.html` file that redirects to `index.html`
- The GitHub Actions workflow handles this automatically

**Assets not loading:**
- Check that `base` path in `vite.config.ts` matches your repository name
- Ensure all asset paths are relative

**API key not working:**
- Verify the secret is set correctly in GitHub
- Check the Actions tab to see if build succeeded
- Ensure API key has proper permissions in Google Cloud Console

**Build fails:**
- Check Actions tab for error logs
- Ensure `package.json` has all dependencies
- Verify Node.js version in workflow (should be 18+)

---

## Quick Start Checklist

- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub
- [ ] `GEMINI_API_KEY` added as GitHub Secret
- [ ] GitHub Pages enabled (Source: GitHub Actions)
- [ ] Workflow file created (`.github/workflows/deploy.yml`)
- [ ] `vite.config.ts` updated with correct base path
- [ ] Push to trigger deployment
- [ ] Check Actions tab for deployment status
- [ ] Visit `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

---

## Viewing Your Deployed App

After deployment completes:
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. You'll see the URL: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
4. It may take a few minutes for the first deployment

