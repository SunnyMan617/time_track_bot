# 🚀 Vercel Deployment Guide - Telegram Bot with Auto-Start

This guide shows you how to deploy your Time Tracker Bot to Vercel so it starts automatically without any manual commands.

## 📋 How It Works

- **Local Development**: Bot runs in polling mode (`npm run bot:dev`)
- **Production (Vercel)**: Bot runs via webhooks (automatic, no commands needed)

When deployed to Vercel, Telegram sends updates directly to your webhook endpoint at `/api/webhook`. The bot responds automatically!

---

## 🔧 Step 1: Prepare Your Environment Variables

Create a `.env` file locally (for testing the webhook setup script):

```env
BOT_TOKEN=your_bot_token_from_botfather
WEBAPP_URL=https://your-app-name.vercel.app
```

Replace:
- `your_bot_token_from_botfather` - Get this from @BotFather on Telegram
- `your-app-name.vercel.app` - Your Vercel deployment URL (you'll get this after deploying)

---

## 🌐 Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure the project:
     - Framework Preset: **Next.js**
     - Root Directory: `./`
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Add Environment Variables in Vercel**
   - In your Vercel project → Settings → Environment Variables
   - Add the following:
     - `BOT_TOKEN` = Your Telegram bot token
     - `WEBAPP_URL` = Your Vercel URL (e.g., `https://your-app.vercel.app`)

4. **Deploy**
   - Click "Deploy"
   - Wait for the deployment to complete
   - Copy your Vercel URL

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Add environment variables
vercel env add BOT_TOKEN
vercel env add WEBAPP_URL
```

---

## 🔗 Step 3: Setup Webhook (Auto-Start the Bot)

After deployment, you need to tell Telegram where to send updates:

1. **Update your local `.env` with your Vercel URL**
   ```env
   BOT_TOKEN=your_bot_token_here
   WEBAPP_URL=https://your-actual-vercel-url.vercel.app
   ```

2. **Run the webhook setup script**
   ```bash
   npm run webhook:setup
   ```

   You should see:
   ```
   🔧 Setting up webhook...
   📍 Webhook URL: https://your-app.vercel.app/api/webhook
   
   ✅ Webhook setup complete!
   
   📊 Webhook Info:
      URL: https://your-app.vercel.app/api/webhook
      Pending updates: 0
      ✅ No errors
   
   🎉 Your bot is now live on Vercel!
      Test it by sending /start to your bot in Telegram
   ```

---

## ✅ Step 4: Test Your Bot

1. Open Telegram
2. Find your bot
3. Send `/start`
4. The mini app should open automatically! 🎉

---

## 🔍 Verify Webhook Status

You can check if your webhook is working:

```bash
# Visit this URL in your browser
https://your-app.vercel.app/api/webhook
```

You should see:
```json
{
  "status": "ok",
  "message": "Telegram webhook is active"
}
```

Or check via Telegram API:
```bash
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```

---

## 🐛 Troubleshooting

### Bot doesn't respond after deployment

1. **Check webhook status:**
   ```bash
   npm run webhook:setup
   ```

2. **Check Vercel logs:**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on the latest deployment → Runtime Logs
   - Look for errors when you send messages to the bot

3. **Verify environment variables:**
   - Vercel Dashboard → Settings → Environment Variables
   - Make sure `BOT_TOKEN` and `WEBAPP_URL` are set correctly

4. **Test the webhook endpoint:**
   ```bash
   curl https://your-app.vercel.app/api/webhook
   ```

### Webhook setup fails

- Make sure your `.env` file has the correct `WEBAPP_URL`
- Make sure your Vercel deployment is live
- Try setting up the webhook again: `npm run webhook:setup`

### "BOT_TOKEN is not set" error

- Add `BOT_TOKEN` to your Vercel environment variables
- Redeploy after adding environment variables

---

## 🔄 Updating Your Bot

When you make changes to your bot:

1. **Push changes to GitHub:**
   ```bash
   git add .
   git commit -m "Update bot"
   git push
   ```

2. **Vercel auto-deploys** (if connected to GitHub)

3. **Webhook remains active** - No need to run setup again!

---

## 🖥️ Local Development

For local testing, use polling mode:

```bash
# Terminal 1: Run Next.js app
npm run dev

# Terminal 2: Run bot in polling mode
npm run bot:dev
```

**Important:** When testing locally, make sure to delete the webhook:

```bash
# Remove webhook to use polling mode
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/deleteWebhook
```

To switch back to production webhook:
```bash
npm run webhook:setup
```

---

## 📊 Architecture

```
Local Development:
  Telegram ←→ Bot (Polling) ←→ Next.js App (localhost:3000)

Production (Vercel):
  Telegram → Webhook → /api/webhook → Bot Handlers → Next.js App
```

---

## 🎯 Summary

1. ✅ Deploy to Vercel
2. ✅ Add `BOT_TOKEN` and `WEBAPP_URL` environment variables
3. ✅ Run `npm run webhook:setup`
4. ✅ Test in Telegram with `/start`
5. ✅ Bot auto-starts automatically!

No manual commands needed after deployment - the bot is always running via webhooks! 🚀

