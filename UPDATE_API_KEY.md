# How to Update After Changing GitHub Secret

## Quick Answer

After updating `GEMINI_API_KEY` in GitHub Secrets, you need to **trigger a new deployment** because:
- Secrets are only used during the build process
- Existing deployments don't automatically rebuild
- You need a new build to use the new secret

## Option 1: Manually Trigger Workflow (Easiest) ✅

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. In the left sidebar, click **"Deploy to GitHub Pages"** workflow
4. Click the **"Run workflow"** button (top right)
5. Select branch: `main`
6. Click **"Run workflow"** (green button)
7. Wait 2-3 minutes for it to complete
8. Refresh your website

## Option 2: Push a New Commit

```bash
# Make a small change (or just add a comment)
git commit --allow-empty -m "Trigger rebuild with new API key"
git push
```

This will automatically trigger the workflow.

## Option 3: Make a Small Code Change

Make any small change to any file, then:
```bash
git add .
git commit -m "Update: trigger rebuild"
git push
```

## After Deployment

1. Wait for the workflow to complete (green checkmark)
2. Refresh your website
3. The new API key will be active!

---

## Why This Is Needed

GitHub Secrets are injected **during the build process**, not at runtime. So:
- ✅ New builds = use new secret
- ❌ Old deployments = still use old secret (or no secret)

That's why you need to trigger a new build after updating secrets.


