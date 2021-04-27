global.Discord = require('discord.js');
global.client = new Discord.Client({
  ws : {
    intents : ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_PRESENCES']
  }
});

global.config = require('./config.json');
global.commands = require('./commands');
global.reaction = require('./reaction');

client.on('message', msg => {

  // Проверка на канал и наличие префикса
  if(msg.channel.type == 'dm') return;
  if(msg.channel.guild.id != config.home) return;
  if(msg.content.substr(0, config.prefix.length) != config.prefix) return;

  const content = msg.content.substr(config.prefix.length).split(/\s+/);
  const command = commands.get(content.shift());

  if(!command) return;

  command.call(msg, content);
});

client.login(config.token);
