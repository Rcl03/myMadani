# Troubleshooting: Images Not Showing

## Quick Checks

1. **Open browser console (F12)** and check for 404 errors
   - Look for failed image requests
   - Note the URL it's trying to load

2. **Check the actual repository name**
   - Your repo might be `myMadani` or `mymadani` (case sensitive!)
   - The base path must match exactly

3. **Verify base path in built files**
   - Check the Actions tab → latest workflow → build logs
   - Look for the base path being used

## Common Issues

### Issue 1: Base Path Mismatch
**Symptom:** Images trying to load from wrong path (e.g., `/applogo.png` instead of `/myMadani/applogo.png`)

**Fix:** The repository name in the base path must match exactly (case-sensitive)

### Issue 2: import.meta.env.BASE_URL Not Working
**Symptom:** Helper function returns wrong path

**Fix:** We may need to hardcode the base path or use a different approach

### Issue 3: Images Not in Public Folder
**Symptom:** 404 errors for all images

**Fix:** Verify images are in the `public/` folder, not `src/`

## Next Steps

1. Check browser console for exact error messages
2. Check the network tab to see what URLs are being requested
3. Verify repository name matches base path


