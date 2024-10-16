import os
from flask import Flask, request
from telegram import Update
from telegram.ext import Application, CommandHandler

# Initialize Flask app
app = Flask(__name__)

# Telegram bot token (use environment variable on Vercel)
TELEGRAM_TOKEN = os.getenv('7786866951:AAGft4uQfnnLiMgOuE_ID3YF0mAF7S54OVk')

# Create an instance of the bot
application = Application.builder().token(TELEGRAM_TOKEN).build()

# Define command handler for /start
async def start(update: Update, context):
    await update.message.reply_text("Fanz twitter tracker bot. just put an username (@xxx) to start tracking.")

# Register /start handler
application.add_handler(CommandHandler('start', start))

# Define webhook route
@app.route(f'/{TELEGRAM_TOKEN}', methods=['POST'])
def webhook():
    """Receives updates from Telegram and processes them."""
    update = Update.de_json(request.get_json(force=True), application.bot)
    application.update_queue.put(update)
    return 'ok'

# Main entry point for the Flask app
if __name__ == '__main__':
    # Set webhook with Telegram
    application.bot.set_webhook(url=f'https://{os.getenv("VERCEL_URL")}/{TELEGRAM_TOKEN}')
    app.run()
