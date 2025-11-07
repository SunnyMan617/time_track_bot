// Script to check current webhook status
import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN is not set in .env file');
  process.exit(1);
}

async function checkWebhook() {
  try {
    const bot = new Telegraf(BOT_TOKEN!);

    console.log('🔍 Checking webhook status...\n');

    const webhookInfo = await bot.telegram.getWebhookInfo();

    if (!webhookInfo.url) {
      console.log('ℹ️  No webhook is set (bot is in polling mode)');
      console.log('   This is normal for local development.\n');
      console.log('💡 To set up webhook for production:');
      console.log('   1. Deploy to Vercel');
      console.log('   2. Update WEBAPP_URL in .env');
      console.log('   3. Run: npm run webhook:setup');
      return;
    }

    console.log('✅ Webhook is active!\n');
    console.log('📊 Webhook Info:');
    console.log(`   URL: ${webhookInfo.url}`);
    console.log(`   Pending updates: ${webhookInfo.pending_update_count}`);
    console.log(`   Max connections: ${webhookInfo.max_connections || 40}`);

    if (webhookInfo.ip_address) {
      console.log(`   IP address: ${webhookInfo.ip_address}`);
    }

    if (webhookInfo.last_error_date) {
      console.log(`\n⚠️  Last Error:`);
      console.log(`   Date: ${new Date(webhookInfo.last_error_date * 1000).toLocaleString()}`);
      console.log(`   Message: ${webhookInfo.last_error_message}`);
    } else {
      console.log('\n✅ No errors reported');
    }

    if (webhookInfo.last_synchronization_error_date) {
      console.log(`\n⚠️  Last Sync Error:`);
      console.log(
        `   Date: ${new Date(webhookInfo.last_synchronization_error_date * 1000).toLocaleString()}`
      );
    }

    console.log('\n💡 To test the bot:');
    console.log('   1. Open Telegram');
    console.log('   2. Send /start to your bot');
    console.log('   3. Click the button to open the app');

  } catch (error) {
    console.error('❌ Failed to check webhook:', error);
    process.exit(1);
  }
}

checkWebhook();

