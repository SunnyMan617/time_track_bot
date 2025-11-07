// Shared bot handlers for both polling and webhook modes
import { Telegraf, Markup, Context } from 'telegraf';

const WEBAPP_URL = process.env.WEBAPP_URL || 'http://localhost:3000';

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

const statsMessage =
  '📊 *View Your Statistics*\n\nOpen the app to see detailed statistics about your time tracking, tasks, and projects.';

const statsKeyboard = Markup.inlineKeyboard([
  [Markup.button.webApp('📊 Open App', WEBAPP_URL)],
]);

export function setupBotHandlers(bot: Telegraf) {
  // Command: /start
  bot.command('start', async (ctx: Context) => {
    try {
      const firstName = ctx.from?.first_name || 'there';
      await ctx.reply(
        `👋 Welcome to Time Tracker Bot, ${firstName}!\n\n` +
          `Track your time, manage tasks, and boost productivity.\n\n` +
          `Click the button below to open the app:`,
        Markup.inlineKeyboard([
          [Markup.button.webApp('🚀 Open Time Tracker', WEBAPP_URL)],
        ])
      );
    } catch (error) {
      console.error('Error in /start command:', error);
      await ctx.reply('An error occurred. Please try again later.');
    }
  });

  // Command: /help
  bot.command('help', async (ctx: Context) => {
    await ctx.reply(helpText, { parse_mode: 'Markdown' });
  });

  // /stats, /active, /stop use the same structure
  const infoCommands: Record<
    string,
    { message: string; buttonLabel?: string; urlSuffix?: string }
  > = {
    stats: { message: statsMessage },
    active: {
      message: '⏱️ *Active Time Tracking*\n\nOpen the app to view and manage your active timers.',
    },
    stop: {
      message: '⏸️ *Stop Time Tracking*\n\nOpen the app to stop your active timers.',
    },
  };

  Object.entries(infoCommands).forEach(([cmd, { message }]) => {
    bot.command(cmd, async (ctx: Context) => {
      try {
        await ctx.reply(message, {
          parse_mode: 'Markdown',
          ...statsKeyboard,
        });
      } catch (error) {
        console.error(`Error in /${cmd} command:`, error);
        await ctx.reply('An error occurred while processing your request.');
      }
    });
  });

  // Button handlers
  bot.hears('⏱️ Quick Start', async (ctx: Context) => {
    await ctx.reply(
      'Start tracking time now!',
      Markup.inlineKeyboard([
        [Markup.button.webApp('🚀 Quick Start', `${WEBAPP_URL}?action=quick-start`)],
      ])
    );
  });

  bot.hears('📈 Stats', async (ctx: Context) => {
    await ctx.reply(statsMessage, {
      parse_mode: 'Markdown',
      ...statsKeyboard,
    });
  });

  bot.hears('⚙️ Settings', async (ctx: Context) => {
    await ctx.reply(
      'Configure your settings:',
      Markup.inlineKeyboard([
        [Markup.button.webApp('⚙️ Open Settings', `${WEBAPP_URL}/settings`)],
      ])
    );
  });

  bot.hears('❓ Help', async (ctx: Context) => {
    // Slightly different help text for button
    const buttonHelpText = helpText.replace(
      '• Set daily reminders\n• Export reports',
      '• Simple and intuitive interface'
    );
    await ctx.reply(buttonHelpText, { parse_mode: 'Markdown' });
  });

  // Global error handling
  bot.catch((err, ctx) => {
    console.error(`Error for ${ctx.updateType}:`, err);
    ctx.reply('An unexpected error occurred. Please try again.');
  });

  return bot;
}

