// Telegram Bot Entry Point (Local Development - Polling Mode)

import { Telegraf } from 'telegraf';
import { setupBotHandlers } from './handlers';

const BOT_TOKEN = process.env.BOT_TOKEN!;

const bot = new Telegraf(BOT_TOKEN);

// Setup all bot handlers
setupBotHandlers(bot);

// Start and shutdown
const startBot = async () => {
  try {
    await bot.launch();
    console.log('✅ Bot started successfully');
  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
};

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

if (require.main === module) {
  startBot();
}

export default bot;
