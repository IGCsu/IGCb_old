global.Discord = require('discord.js');
global.client = new Discord.Client();
global.config = require('./config.json');

client.on('ready', () => {
  global.commands = require('./commands');
  global.getCommand = require('./getCommand');
});

client.on('message', msg => {

  // Проверка на канал и наличие префикса
  if(msg.channel.type == 'dm') return;
  if(msg.channel.guild.id != config.home) return;
  if(msg.content.substr(0, config.prefix.length) != config.prefix) return;

  const content = msg.content.substr(config.prefix.length).split(/\s+/);

  if(!content.length) return;

  const command = getCommand(content.shift());

  if(!command) return;

  command.call(msg, content);
});

client.login(config.token);
