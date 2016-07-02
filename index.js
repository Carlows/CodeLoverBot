var TelegramBot = require('node-telegram-bot-api');
var Cleverbot = require('cleverbot-node');
var format = require('string-template');
var mongoose = require('mongoose');
var moment = require('moment');
var _ = require('lodash');

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
  firstname: String,
  lastname: String,
  email: String
});

var Member = mongoose.model('Member', memberSchema);

bot.onText(/\/faggot/, function(msg, match) {
  var chatId = msg.chat.id;

  Member.find({}, function(err, members) {
    if(err) {
      console.log(err);
      return;
    }

    var faggot = members[Math.floor(Math.random() * members.length)];
    bot.sendMessage(chatId, format("{firstname} {lastname} es marico", { firstname: faggot.firstname, lastname: faggot.lastname }));
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

  var today = moment().startOf('day');
  var tomorrow = moment(today).add(1, 'days');

  Message.find({ createdAt: { $gte: today.toDate(), $lt: tomorrow.toDate() } },
  function (err, messages) {
    if(err) {
      console.log(err)
      return;
    }

    if(messages.length > 0) {
      var formattedMsgs = _.map(messages, function(msg) { return format("- {msj}\n", { msj: msg.message }) });

      bot.sendMessage(chatId, format("Important messages for *{date}*\n\n{msgs}", {
        date: moment().format("dddd, MMMM Do"),
        msgs: formattedMsgs.join('')
      }), { parse_mode: "Markdown" });
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

bot.onText(/\/addmember (\w+) (\w+) (.+@\w+\.\w+)/, function(msg, match) {
  var chatId = msg.chat.id;
  var memberName = match[1];
  var memberLastname = match[2];
  var memberEmail = match[3];

  var member = new Member({ firstname: memberName, lastname: memberLastname, email: memberEmail });

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
      var formattedMembers = _.map(members, function(mbr) { return format("- {firstname} {lastname} *{email}*\n", {
          firstname: mbr.firstname,
          lastname: mbr.lastname,
          email: mbr.email || 'faggot has no email set up'
        })
      });

      bot.sendMessage(chatId, format("*Group member contact list*\n\n{members}", {
        members: formattedMembers.join('')
      }), { parse_mode: "Markdown" });
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
