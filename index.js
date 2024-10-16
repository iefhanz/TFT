const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

let targets = {};  // This will store the targets for each user

// Start command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome! Use /track @username to track a Twitter account.");
});

// Track command
bot.onText(/\/track (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const target = match[1];

  if (!target.startsWith('@')) {
    return bot.sendMessage(chatId, 'Please provide a valid username starting with @.');
  }

  if (!targets[chatId]) {
    targets[chatId] = [];
  }

  if (!targets[chatId].includes(target)) {
    targets[chatId].push(target);
  }

  bot.sendMessage(chatId, `You are now tracking ${target}.`);

  // Implement API call to track new followers using GetMoni API (example usage)
  const apiUrl = `https://api.getmoni.io/v1/track-following/${target}`;
  try {
    const response = await axios.get(apiUrl);
    bot.sendMessage(chatId, `${target} is being tracked.`);
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
});

// Add command
bot.onText(/\/add (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const target = match[1];

  if (!target.startsWith('@')) {
    return bot.sendMessage(chatId, 'Please provide a valid username starting with @.');
  }

  if (!targets[chatId]) {
    targets[chatId] = [];
  }

  if (!targets[chatId].includes(target)) {
    targets[chatId].push(target);
    bot.sendMessage(chatId, `${target} added to tracking list.`);
  } else {
    bot.sendMessage(chatId, `${target} is already in the tracking list.`);
  }
});

// Delete command
bot.onText(/\/delete (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const target = match[1];

  if (targets[chatId]) {
    targets[chatId] = targets[chatId].filter(t => t !== target);
    bot.sendMessage(chatId, `${target} removed from tracking list.`);
  } else {
    bot.sendMessage(chatId, `${target} is not in your tracking list.`);
  }
});
