// Telegram Bot Entry Point

import { Telegraf, Markup } from 'telegraf';
import prisma from '../lib/db';

const bot = new Telegraf(process.env.BOT_TOKEN!);

const WEBAPP_URL = process.env.WEBAPP_URL || 'https://your-app-url.vercel.app';

// Command: /start
bot.command('start', async (ctx) => {
  try {
    const telegramUser = ctx.from;

    // Create or update user in database
    await prisma.user.upsert({
      where: { telegramId: BigInt(telegramUser.id) },
      update: {
        username: telegramUser.username,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        languageCode: telegramUser.language_code,
        isPremium: telegramUser.is_premium || false,
        isActive: true,
      },
      create: {
        telegramId: BigInt(telegramUser.id),
        username: telegramUser.username,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        languageCode: telegramUser.language_code,
        isPremium: telegramUser.is_premium || false,
      },
    });

    await ctx.reply(
      `👋 Welcome to Time Tracker Bot!\n\n` +
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
// bot.command('stats', async (ctx) => {
//   try {
//     const telegramUser = ctx.from;
//     const user = await prisma.user.findUnique({
//       where: { telegramId: BigInt(telegramUser.id) },
//       include: {
//         timeEntries: {
//           where: {
//             startTime: {
//               gte: new Date(new Date().setHours(0, 0, 0, 0)),
//             },
//           },
//         },
//         tasks: true,
//       },
//     });

//     if (!user) {
//       await ctx.reply('User not found. Please use /start first.');
//       return;
//     }

//     const todayTime = user.timeEntries.reduce((acc, entry) => {
//       return acc + (entry.duration || 0);
//     }, 0);

//     const hours = Math.floor(todayTime / 3600);
//     const minutes = Math.floor((todayTime % 3600) / 60);

//     const activeTasks = user.tasks.filter((t) => t.status === 'IN_PROGRESS').length;
//     const completedTasks = user.tasks.filter((t) => t.status === 'DONE').length;

//     const statsText = `
// 📊 *Your Statistics*

// ⏱️ Today: ${hours}h ${minutes}m
// ✅ Completed Tasks: ${completedTasks}
// 🔄 Active Tasks: ${activeTasks}
// 📝 Total Tasks: ${user.tasks.length}

// Open the app for detailed statistics!
// `;

//     await ctx.reply(statsText, {
//       parse_mode: 'Markdown',
//       ...Markup.inlineKeyboard([[Markup.button.webApp('📊 Open App', WEBAPP_URL)]]),
//     });
//   } catch (error) {
//     console.error('Error in /stats command:', error);
//     await ctx.reply('An error occurred while fetching statistics.');
//   }
// });

// Command: /active
bot.command('active', async (ctx) => {
  try {
    const telegramUser = ctx.from;
    const user = await prisma.user.findUnique({
      where: { telegramId: BigInt(telegramUser.id) },
      include: {
        timeEntries: {
          where: { endTime: null },
          include: { task: true, project: true },
          orderBy: { startTime: 'desc' },
        },
      },
    });

    if (!user) {
      await ctx.reply('User not found. Please use /start first.');
      return;
    }

    if (user.timeEntries.length === 0) {
      await ctx.reply('No active time tracking. Start tracking in the app!');
      return;
    }

    const activeText = user.timeEntries
      .map((entry) => {
        const elapsed = Math.floor((Date.now() - entry.startTime.getTime()) / 1000);
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const taskInfo = entry.task ? ` - ${entry.task.title}` : '';
        const projectInfo = entry.project ? ` [${entry.project.name}]` : '';
        return `⏱️ ${hours}h ${minutes}m${taskInfo}${projectInfo}`;
      })
      .join('\n');

    await ctx.reply(`🔄 *Active Time Tracking:*\n\n${activeText}`, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([[Markup.button.webApp('📊 Open App', WEBAPP_URL)]]),
    });
  } catch (error) {
    console.error('Error in /active command:', error);
    await ctx.reply('An error occurred while fetching active entries.');
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
  await ctx.replyWithChatAction('typing');
  await ctx.reply('/stats').then(() => bot.handleUpdate(ctx.update));
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
  await ctx.reply('/help').then(() => bot.handleUpdate(ctx.update));
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

