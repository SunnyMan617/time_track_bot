# 🚀 Deployment Guide

## Deploy Web App to Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier is fine)

### Step 1: Push to GitHub

1. Initialize git (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub
3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Import Project"**
3. Select your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. Add Environment Variables:
   - `DATABASE_URL` - Your production database URL (see below)
   - `BOT_TOKEN` - Your Telegram bot token
   - `WEBAPP_URL` - Will be your Vercel URL (e.g., https://your-app.vercel.app)

6. Click **"Deploy"**

### Step 3: Setup Production Database

For Vercel, you'll need a cloud database. Options:

#### Option A: Vercel Postgres (Recommended)
1. In your Vercel project → Storage → Create Database
2. Select "Postgres"
3. Copy the connection string
4. Add it as `DATABASE_URL` environment variable

#### Option B: Supabase (Free)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database → Connection String
4. Copy the URI and add to Vercel as `DATABASE_URL`

### Step 4: Update Local .env

After deployment, update your local `.env`:

```env
BOT_TOKEN=your_bot_token_here
WEBAPP_URL=https://your-actual-vercel-url.vercel.app
DATABASE_URL=your_production_database_url
```

### Step 5: Restart Your Bot

Stop and restart your local bot so it uses the new WEBAPP_URL:

```bash
npm run bot
```

---

## 🧪 Alternative: Test Locally with ngrok

If you want to test without deploying:

1. Install ngrok: https://ngrok.com/download
2. Run your Next.js app: `npm run dev`
3. In another terminal: `ngrok http 3000`
4. Copy the https URL (e.g., `https://abc123.ngrok.io`)
5. Update `.env`: `WEBAPP_URL=https://abc123.ngrok.io`
6. Restart the bot

**Note:** ngrok URLs change each time, so this is only for testing.

---

## ✅ Verify It Works

1. Open Telegram bot
2. Send `/start`
3. Click **"📊 Open App"**
4. You should see the web interface!

