var TelegramBot = require('node-telegram-bot-api');
var Cleverbot = require('cleverbot-node');
var format = require('string-template');

var token = process.env.BOT_TOKEN;

var bot = new TelegramBot(token, { polling: true });
var cleverbot = new Cleverbot;

var arrayOfMembers = process.env.MEMBERS.split(',');

bot.onText(/\/faggot/, function(msg, match) {
  var chatId = msg.chat.id;
  var faggot = arrayOfMembers[Math.floor(Math.random() * arrayOfMembers.length)];
  bot.sendMessage(chatId, format("{name} es marico", { name: faggot }));
});

bot.onText(/\/hey (.+)/, function(msg, match) {
  var chatId = msg.chat.id;
  var receivedText = match[1];

  Cleverbot.prepare(function(){
    cleverbot.write(receivedText, function (response) {
         bot.sendMessage(chatId, response.message);
    });
  });
});

bot.onText(/\/marico/, function(msg, match) {
  var chatId = msg.chat.id;
  bot.sendMessage(chatId, format("Marico el que lo lea"));
});
