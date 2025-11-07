// Quick test to see if bot connects
require('dotenv').config();
const { Telegraf } = require('telegraf');

console.log('Testing bot connection...');
console.log('BOT_TOKEN exists:', !!process.env.BOT_TOKEN);
console.log('BOT_TOKEN starts with:', process.env.BOT_TOKEN ? process.env.BOT_TOKEN.substring(0, 10) + '...' : 'NOT FOUND');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('start', (ctx) => {
  console.log('Received /start command from:', ctx.from.username || ctx.from.first_name);
  ctx.reply('✅ Bot is working!');
});

bot.launch()
  .then(() => {
    console.log('✅ Bot started successfully and is listening for messages!');
    console.log('Try sending /start to your bot in Telegram');
  })
  .catch((error) => {
    console.error('❌ Failed to start bot:', error.message);
    process.exit(1);
  });

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

