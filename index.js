var TelegramBot = require('node-telegram-bot-api');
var Cleverbot = require('cleverbot-node');
var format = require('string-template');
var mongoose = require('mongoose');
var moment = require('moment');

var token = process.env.BOT_TOKEN;

var bot = new TelegramBot(token, { polling: true });
var cleverbot = new Cleverbot;

var arrayOfMembers = process.env.MEMBERS.split(',');

// mongodb://<dbuser>:<dbpassword>@ds011765.mlab.com:11765/heroku_v61cn6b3
// we might want to provide this through an enviroment variable
// so.. TODO.
mongoose.connect("mongodb://littlemonkey:littlemonkey@ds011765.mlab.com:11765/heroku_v61cn6b3");

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log("Connected succesfully to mongoose");
});

// This is our Schema
var messageSchema = mongoose.Schema({
  message: String
}, {
  timestamps: true
});

// This is our model
var Message = mongoose.model('Message', messageSchema);

var memberSchema = mongoose.Schema({
  name: String
});

var Member = mongoose.model('Member', memberSchema);

bot.onText(/\/faggot/, function(msg, match) {
  var chatId = msg.chat.id;

  Member.find({}, function(err, members) {
    if(err) {
      console.log(err);
      return;
    }

    var faggot = members[Math.floor(Math.random() * members.length)].name;
    bot.sendMessage(chatId, format("{name} es marico", { name: faggot }));
  });
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

bot.onText(/\/storeimportant (.+)/, function(msg, match) {
  var chatId = msg.chat.id;
  var messageToStore = match[1];

  var msg = new Message({
    message: messageToStore
  });

  msg.save(function (err, message) {
    if (err) {
        console.log(err);
        return;
    }

    bot.sendMessage(chatId, "Message was stored succesfully!");
  });
});

bot.onText(/\/important/, function(msg, match) {
  var chatId = msg.chat.id;

  bot.sendMessage(chatId, format("Important messages for {date}", { date: moment().format("dddd, MMMM Do") }));

  var today = moment().startOf('day');
  var tomorrow = moment(today).add(1, 'days');

  Message.find({ createdAt: { $gte: today.toDate(), $lt: tomorrow.toDate() } },
  function (err, messages) {
    if(err) {
      console.log(err)
      return;
    }

    if(messages.length > 0) {
      messages.forEach(function (msg) {
        bot.sendMessage(chatId, format("- {msg}", { msg: msg.message }));
      });
    } else {
      bot.sendMessage(chatId, "No messages stored for today.");
    }
  });
});

bot.onText(/\/clearimportant/, function(msg, match) {
  var chatId = msg.chat.id;

  bot.sendMessage(chatId, "cleaning up messages for today.");

  Message.remove({}, function(err) {
    if(err) {
      bot.sendMessage(chatId, "couldn't do that :(");
    }
  });
});

bot.onText(/\/addmember (\w+)/, function(msg, match) {
  var chatId = msg.chat.id;
  var memberName = match[1];

  var member = new Member({ name: memberName });

  member.save(function(err, obj) {
    if(err) {
      console.log(err);
      return;
    }

    bot.sendMessage(chatId, "Member saved correctly");
  });
});

bot.onText(/\/listmembers/, function(msg, match) {
  var chatId = msg.chat.id;

  Member.find({},
  function (err, members) {
    if(err) {
      console.log(err)
      return;
    }

    if(members.length > 0) {
      members.forEach(function (mbr) {
        bot.sendMessage(chatId, format("- {member}", { member: mbr.name }));
      });
    } else {
      bot.sendMessage(chatId, "No members stored yet.");
    }
  });
});

bot.onText(/\/clearmembers/, function(msg, match) {
  var chatId = msg.chat.id;

  bot.sendMessage(chatId, "Cleaning up members.");

  Member.remove({}, function(err) {
    if(err) {
      bot.sendMessage(chatId, "Couldn't do that :(");
    }
  });
});
