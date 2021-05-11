global.Discord = require('discord.js');
global.client = new Discord.Client({intents : Discord.Intents.ALL});
global.config = require('./config.json');
global.DB = new (require('sync-mysql'))(config.mysql);

client.on('ready', msg => {
  global.commands = require('./commands');

  global.reaction = require('./functions/reaction');
  global.send = require('./functions/send');
  global.num2str = require('./functions/num2str');
  global.toggleRole = require('./functions/toggleRole');
  global.user2name = require('./functions/user2name');

  console.log('== Bot ready ==');
});

client.on('message', msg => {

  // Проверка на канал и наличие префикса
  if(msg.author.id == client.user.id) return;
  if(msg.channel.type == 'dm') return send.error(msg, 'Лс для пидоров');
  if(msg.channel.guild.id != config.home) return;
  if(msg.content.substr(0, config.prefix.length) != config.prefix) return;

  const content = msg.content.substr(config.prefix.length).split(/\s+/);
  const command = commands.get(content.shift());

  if(!command) return;

  command.call(msg, content);
});

client.login(config.token);
