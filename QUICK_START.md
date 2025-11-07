# 🚀 Quick Start Guide

## For Local Development

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cat > .env << EOF
BOT_TOKEN=your_bot_token_here
WEBAPP_URL=http://localhost:3000
EOF

# 3. Start the web app (Terminal 1)
npm run dev

# 4. Start the bot (Terminal 2)
npm run bot:dev

# 5. Test in Telegram
# Send /start to your bot
```

---

## For Production (Vercel)

```bash
# 1. Deploy to Vercel
# - Push code to GitHub
# - Import to Vercel
# - Add environment variables:
#   - BOT_TOKEN
#   - WEBAPP_URL (your Vercel URL)

# 2. Setup webhook (after deployment)
npm run webhook:setup

# 3. Done! Bot auto-starts automatically
# Test by sending /start in Telegram
```

---

## Useful Commands

```bash
npm run dev              # Start Next.js app
npm run bot:dev          # Start bot (local polling)
npm run webhook:setup    # Setup webhook (production)
npm run webhook:check    # Check webhook status
```

---

## Switching Between Local and Production

### Going from Production → Local
```bash
# Delete webhook to use polling mode
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/deleteWebhook

# Start local bot
npm run bot:dev
```

### Going from Local → Production
```bash
# Stop local bot (Ctrl+C)

# Setup webhook
npm run webhook:setup
```

---

## Troubleshooting

**Bot not responding?**
```bash
npm run webhook:check  # Check current status
```

**Need to reset webhook?**
```bash
npm run webhook:setup  # Re-run setup
```

**Local development issues?**
```bash
# Make sure webhook is deleted
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/deleteWebhook
```

---

📖 **Full Documentation:**
- [README.md](./README.md) - Complete project overview
- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Detailed Vercel deployment guide

