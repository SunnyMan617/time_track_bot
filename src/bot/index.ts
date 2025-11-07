// Telegram Bot Entry Point

import { Telegraf, Markup } from 'telegraf';

const bot = new Telegraf(process.env.BOT_TOKEN!);

const WEBAPP_URL = process.env.WEBAPP_URL || 'https://your-app-url.vercel.app';

// Command: /start
bot.command('start', async (ctx) => {
  try {
    const user = ctx.from;
    const firstName = user.first_name || 'there';

    await ctx.reply(
      `👋 Welcome to Time Tracker Bot, ${firstName}!\n\n` +
        `Track your time, manage tasks, and boost productivity.\n\n` +
        `Use the buttons below to get started:`,
      Markup.keyboard([
        [Markup.button.webApp('📊 Open App', WEBAPP_URL)],
        ['⏱️ Quick Start', '📈 Stats'],
        ['⚙️ Settings', '❓ Help'],
      ]).resize()
    );
  } catch (error) {
    console.error('Error in /start command:', error);
    await ctx.reply('An error occurred. Please try again later.');
  }
});

// Command: /help
bot.command('help', async (ctx) => {
  const helpText = `
🤖 *Time Tracker Bot - Help*

*Commands:*
/start - Start the bot
/help - Show this help message
/stats - View your time statistics
/active - Show active time entries
/stop - Stop current time tracking

*Quick Actions:*
⏱️ Quick Start - Start tracking time quickly
📈 Stats - View your statistics
⚙️ Settings - Configure your preferences
📊 Open App - Open the full mini app

*Features:*
• Track time for tasks and projects
• Create and manage projects
• View detailed statistics
• Set daily reminders
• Export reports

Need more help? Contact @your_support
`;

  await ctx.reply(helpText, { parse_mode: 'Markdown' });
});

// Command: /stats
bot.command('stats', async (ctx) => {
  try {
    await ctx.reply(
      '📊 *View Your Statistics*\n\n' +
        'Open the app to see detailed statistics about your time tracking, tasks, and projects.',
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([[Markup.button.webApp('📊 Open App', WEBAPP_URL)]]),
      }
    );
  } catch (error) {
    console.error('Error in /stats command:', error);
    await ctx.reply('An error occurred while processing your request.');
  }
});

// Command: /active
bot.command('active', async (ctx) => {
  try {
    await ctx.reply(
      '⏱️ *Active Time Tracking*\n\n' +
        'Open the app to view and manage your active timers.',
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([[Markup.button.webApp('📊 Open App', WEBAPP_URL)]]),
      }
    );
  } catch (error) {
    console.error('Error in /active command:', error);
    await ctx.reply('An error occurred while processing your request.');
  }
});

// Command: /stop
bot.command('stop', async (ctx) => {
  try {
    await ctx.reply(
      '⏸️ *Stop Time Tracking*\n\n' +
        'Open the app to stop your active timers.',
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([[Markup.button.webApp('📊 Open App', WEBAPP_URL)]]),
      }
    );
  } catch (error) {
    console.error('Error in /stop command:', error);
    await ctx.reply('An error occurred while processing your request.');
  }
});

// Handle "Quick Start" button
bot.hears('⏱️ Quick Start', async (ctx) => {
  await ctx.reply(
    'Start tracking time now!',
    Markup.inlineKeyboard([[Markup.button.webApp('🚀 Quick Start', `${WEBAPP_URL}?action=quick-start`)]])
  );
});

// Handle "Stats" button
bot.hears('📈 Stats', async (ctx) => {
  await ctx.reply(
    '📊 *View Your Statistics*\n\n' +
      'Open the app to see detailed statistics about your time tracking, tasks, and projects.',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([[Markup.button.webApp('📊 Open App', WEBAPP_URL)]]),
    }
  );
});

// Handle "Settings" button
bot.hears('⚙️ Settings', async (ctx) => {
  await ctx.reply(
    'Configure your settings:',
    Markup.inlineKeyboard([[Markup.button.webApp('⚙️ Open Settings', `${WEBAPP_URL}/settings`)]])
  );
});

// Handle "Help" button
bot.hears('❓ Help', async (ctx) => {
  const helpText = `
🤖 *Time Tracker Bot - Help*

*Commands:*
/start - Start the bot
/help - Show this help message
/stats - View your time statistics
/active - Show active time entries
/stop - Stop current time tracking

*Quick Actions:*
⏱️ Quick Start - Start tracking time quickly
📈 Stats - View your statistics
⚙️ Settings - Configure your preferences
📊 Open App - Open the full mini app

*Features:*
• Track time for tasks and projects
• Create and manage projects
• View detailed statistics
• Simple and intuitive interface

Need more help? Contact @your_support
`;

  await ctx.reply(helpText, { parse_mode: 'Markdown' });
});

// Error handling
bot.catch((err, ctx) => {
  console.error(`Error for ${ctx.updateType}:`, err);
  ctx.reply('An unexpected error occurred. Please try again.');
});

// Start bot
const startBot = async () => {
  try {
    await bot.launch();
    console.log('✅ Bot started successfully');
  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Start the bot if this file is run directly
if (require.main === module) {
  startBot();
}

export default bot;

