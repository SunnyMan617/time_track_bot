# ⏱️ Time Tracker Telegram Bot

A powerful time tracking bot for Telegram with a beautiful web interface. Track your time, manage tasks, and boost productivity - all within Telegram!

## ✨ Features

- 🤖 **Telegram Mini App** - Beautiful web interface inside Telegram
- ⏱️ **Time Tracking** - Track time for tasks and projects
- 📊 **Statistics & Reports** - Visualize your productivity
- 📝 **Task Management** - Create and organize tasks
- 🎯 **Project Organization** - Group tasks by projects
- 🚀 **Auto-Start on Vercel** - No manual commands needed after deployment

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Create a `.env` file:

```env
BOT_TOKEN=your_bot_token_from_botfather
WEBAPP_URL=http://localhost:3000
```

Get your bot token from [@BotFather](https://t.me/BotFather) on Telegram.

### 3. Run the Application

**Terminal 1: Start the web app**
```bash
npm run dev
```

**Terminal 2: Start the bot (polling mode)**
```bash
npm run bot:dev
```

### 4. Test in Telegram

1. Find your bot in Telegram
2. Send `/start`
3. Click "🚀 Open Time Tracker"
4. Start tracking time! 🎉

---

## 🌐 Deploy to Vercel (Production)

For production deployment with auto-start (no manual commands needed), see:

📖 **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** - Complete deployment guide

**Quick summary:**

1. Deploy to Vercel
2. Add environment variables (`BOT_TOKEN`, `WEBAPP_URL`)
3. Run `npm run webhook:setup`
4. Bot auto-starts automatically via webhooks! ✅

---

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── webhook/        # Telegram webhook endpoint (Vercel)
│   │   ├── tasks/          # Task management API
│   │   ├── projects/       # Project management API
│   │   └── time/           # Time tracking API
│   ├── page.tsx            # Main web interface
│   └── layout.tsx          # App layout
├── src/
│   ├── bot/
│   │   ├── index.ts        # Bot entry point (local polling)
│   │   └── handlers.ts     # Shared bot handlers
│   └── lib/
│       └── store.ts        # Data persistence
├── scripts/
│   └── setup-webhook.ts    # Webhook setup script
└── components/             # React components
```

---

## 🛠️ Available Commands

```bash
# Development
npm run dev          # Start Next.js web app
npm run bot:dev      # Start bot in polling mode (local)

# Production
npm run build        # Build for production
npm run start        # Start production server
npm run webhook:setup # Setup webhook for Vercel deployment

# Bot (local only)
npm run bot          # Start bot without watch mode
```

---

## 🔄 Development vs Production

| Mode | Development | Production |
|------|------------|------------|
| **Platform** | Local | Vercel |
| **Bot Mode** | Polling | Webhook |
| **Start Command** | `npm run bot:dev` | Automatic (no command) |
| **Web App URL** | http://localhost:3000 | https://time-track-bot.vercel.app |

---

## 📚 Documentation

- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Detailed Vercel deployment guide with auto-start
- [DEPLOYMENT.md](./DEPLOYMENT.md) - General deployment options

---

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `BOT_TOKEN` | Telegram bot token from @BotFather | `123456:ABCdef...` |
| `WEBAPP_URL` | Your web app URL | `` |
| `DATABASE_URL` | Database connection (optional) | PostgreSQL connection string |

---

## 🤖 Bot Commands

- `/start` - Open the mini app
- `/help` - Show help message
- `/stats` - View statistics
- `/active` - Show active timers
- `/stop` - Stop time tracking

---

## 🐛 Troubleshooting

### Bot doesn't respond after deployment

1. Check webhook status: `npm run webhook:setup`
2. Verify environment variables in Vercel
3. Check Vercel logs for errors

### Local bot not working

1. Make sure `.env` file exists with `BOT_TOKEN`
2. Delete webhook: `curl https://api.telegram.org/bot<TOKEN>/deleteWebhook`
3. Restart bot: `npm run bot:dev`

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for more troubleshooting tips.

---

## 🎨 Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Bot**: Telegraf (Telegram Bot Framework)
- **Deployment**: Vercel (automatic with webhooks)
- **Charts**: Chart.js

---

## 📄 License

MIT License - feel free to use this project for your own time tracking needs!

---

## 🙏 Credits

Built with ❤️ using:
- [Next.js](https://nextjs.org/)
- [Telegraf](https://telegraf.js.org/)
- [Vercel](https://vercel.com/)

---

**Need help?** Check out [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed deployment instructions!
