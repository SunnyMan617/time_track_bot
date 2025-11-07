// Script to set up Telegram webhook after Vercel deployment
import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL;

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN is not set in .env file');
  process.exit(1);
}

if (!WEBAPP_URL) {
  console.error('❌ WEBAPP_URL is not set in .env file');
  process.exit(1);
}

const webhookUrl = `${WEBAPP_URL}/api/webhook`;

async function setupWebhook() {
  try {
    const bot = new Telegraf(BOT_TOKEN!);

    console.log('🔧 Setting up webhook...');
    console.log(`📍 Webhook URL: ${webhookUrl}`);

    // Set the webhook
    await bot.telegram.setWebhook(webhookUrl);

    // Verify the webhook
    const webhookInfo = await bot.telegram.getWebhookInfo();
    
    console.log('\n✅ Webhook setup complete!');
    console.log('\n📊 Webhook Info:');
    console.log(`   URL: ${webhookInfo.url}`);
    console.log(`   Pending updates: ${webhookInfo.pending_update_count}`);
    
    if (webhookInfo.last_error_date) {
      console.log(`   ⚠️  Last error: ${webhookInfo.last_error_message}`);
    } else {
      console.log('   ✅ No errors');
    }

    console.log('\n🎉 Your bot is now live on Vercel!');
    console.log('   Test it by sending /start to your bot in Telegram');

  } catch (error) {
    console.error('❌ Failed to setup webhook:', error);
    process.exit(1);
  }
}

setupWebhook();

