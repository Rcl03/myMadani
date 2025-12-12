# Quick Start: Deploy to GitHub Pages

## 🚀 5-Minute Setup

### Step 1: Create GitHub Repository
```bash
# If you haven't initialized git yet
git init
git add .
git commit -m "Initial commit"
git branch -M main

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2: Add API Key Secret
1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `GEMINI_API_KEY`
5. Value: Your Gemini API key
6. Click **Add secret**

### Step 3: Enable GitHub Pages
1. In your repository, go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save (no need to select a branch)

### Step 4: Deploy!
```bash
git add .
git commit -m "Setup GitHub Pages"
git push
```

That's it! 🎉

The GitHub Action will automatically:
- ✅ Build your app
- ✅ Deploy to GitHub Pages
- ✅ Your app will be live in ~2 minutes

**Your app URL:** `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

---

## 📋 What Was Set Up

✅ GitHub Actions workflow (`.github/workflows/deploy.yml`)
- Automatically builds and deploys on every push to `main`
- Uses your `GEMINI_API_KEY` secret securely
- Handles base path automatically

✅ Vite configuration updated
- Automatically detects GitHub Pages base path
- Works for both local dev and GitHub Pages

✅ 404.html for SPA routing
- Handles client-side routing on GitHub Pages

✅ Deployment scripts in package.json
- `npm run deploy` for manual deployment (if needed)

---

## 🔍 Check Deployment Status

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. You'll see the deployment workflow running
4. Click on it to see build logs
5. When it says "Deploy to GitHub Pages" is complete, your site is live!

---

## 🐛 Troubleshooting

**Build fails?**
- Check the Actions tab for error messages
- Make sure `GEMINI_API_KEY` secret is set correctly
- Verify all dependencies are in `package.json`

**404 errors?**
- Wait a few minutes for GitHub Pages to update
- Clear your browser cache
- Check that the base path matches your repo name

**API not working?**
- Verify `GEMINI_API_KEY` secret is set
- Check browser console for errors
- Ensure API key has proper permissions

---

## 📝 Next Steps

- Custom domain? See `GITHUB_DEPLOYMENT.md` for instructions
- Want to deploy manually? Run `npm install -g gh-pages` then `npm run deploy`
- Need help? Check the full guide in `GITHUB_DEPLOYMENT.md`

