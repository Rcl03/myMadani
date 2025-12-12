# Deployment Guide for MyMadani

This guide covers multiple deployment options for your Vite + React application.

## Prerequisites

1. **Build the application:**
   ```bash
   npm install
   npm run build
   ```
   This creates a `dist` folder with production-ready static files.

2. **Environment Variables:**
   Create a `.env` or `.env.production` file with:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

Vercel is perfect for React/Vite apps with automatic deployments.

**Steps:**
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```
   Follow the prompts. Vercel will detect Vite automatically.

3. **Or use GitHub integration:**
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variable `GEMINI_API_KEY` in project settings
   - Deploy!

**Configuration:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

---

### Option 2: Netlify

Similar to Vercel, great for static sites.

**Steps:**
1. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. Build and deploy:
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

3. **Or use Netlify UI:**
   - Push to GitHub
   - Go to [netlify.com](https://netlify.com)
   - Add new site from Git
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add environment variable `GEMINI_API_KEY` in Site settings

---

### Option 3: GitHub Pages

Free hosting for static sites.

**Steps:**
1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Update `package.json`:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/mymadani"
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

**Note:** For environment variables, you'll need to use GitHub Secrets and a build script, or use a service like Vercel/Netlify.

---

### Option 4: Cloudflare Pages

Fast and free static hosting.

**Steps:**
1. Push code to GitHub/GitLab
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
3. Pages → Create a project
4. Connect repository
5. Build settings:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`
6. Add environment variable `GEMINI_API_KEY`

---

### Option 5: Traditional Web Hosting (cPanel, FTP)

For shared hosting or VPS.

**Steps:**
1. Build the app:
   ```bash
   npm run build
   ```

2. Upload the entire `dist` folder contents to your web server's public directory (usually `public_html` or `www`)

3. **Important:** For environment variables, you'll need to:
   - Use a build-time replacement script, OR
   - Use a `.env` file that gets loaded (requires server-side support), OR
   - Hardcode the API key in the build (not recommended for security)

---

### Option 6: Docker + Cloud Hosting

For more control and containerization.

**Create `Dockerfile`:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Create `nginx.conf`:**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Deploy:**
```bash
docker build -t mymadani .
docker run -p 80:80 mymadani
```

---

## Environment Variables Setup

For all platforms, make sure to set `GEMINI_API_KEY` as an environment variable:

- **Vercel/Netlify:** Project Settings → Environment Variables
- **Cloudflare Pages:** Settings → Environment Variables
- **GitHub Actions:** Repository Secrets
- **Docker:** Use `-e GEMINI_API_KEY=...` or `.env` file

---

## Post-Deployment Checklist

- [ ] Test the application in production
- [ ] Verify API calls work (check browser console)
- [ ] Test on mobile devices
- [ ] Set up custom domain (if needed)
- [ ] Enable HTTPS (automatic on most platforms)
- [ ] Monitor error logs

---

## Quick Start (Recommended: Vercel)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Add environment variable
vercel env add GEMINI_API_KEY

# 5. Redeploy
vercel --prod
```

Your app will be live at `https://your-project.vercel.app`

---

## Troubleshooting

**Build fails:**
- Check Node.js version (should be 18+)
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

**API not working:**
- Verify `GEMINI_API_KEY` is set in production environment
- Check browser console for errors
- Ensure API key has proper permissions

**404 errors on routes:**
- Configure your hosting to serve `index.html` for all routes (SPA routing)
- Vercel/Netlify handle this automatically

