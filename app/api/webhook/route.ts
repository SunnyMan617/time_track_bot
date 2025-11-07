// Telegram Bot Webhook Endpoint for Vercel
import { Telegraf } from 'telegraf';
import { setupBotHandlers } from '@/src/bot/handlers';
import { NextRequest, NextResponse } from 'next/server';

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN is not set');
}

const bot = new Telegraf(BOT_TOKEN);
setupBotHandlers(bot);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Process the update
    await bot.handleUpdate(body);
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle GET requests to verify the webhook is working
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Telegram webhook is active',
  });
}

