var TelegramBot = require('node-telegram-bot-api');
var Cleverbot = require('cleverbot-node');

var token = process.env.BOT_TOKEN;

var bot = new TelegramBot(token, { polling: true });
var cleverbot = new Cleverbot;

bot.onText(/\/hi/, function(msg, match) {
  var chatId = msg.chat.id;
  console.log('called ' + chatId);
  bot.sendMessage(chatId, "Luque es marico");
});

bot.onText(/\/question (.+)/, function(msg, match) {
  var chatId = msg.chat.id;
  var receivedText = match[1];

  Cleverbot.prepare(function(){
    cleverbot.write(receivedText, function (response) {
         bot.sendMessage(chatId, response.message);
    });
  });
});

bot.on('message', function(msg) {
  var chatId = msg.chat.id;

  if(msg.sticker) {
    bot.sendMessage(chatId, "msg was a sticker");
  }
});
