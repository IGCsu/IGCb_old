global.Discord = require('discord.js');
global.client = new Discord.Client();
global.config = require('./config.json');

global.commands = require('./commands');
global.getCommand = require('./getCommand');

// client.on('ready', client.generateInvite(['ADMINISTRATOR']).then(console.log));

client.on('message', msg => {

  // Проверка на канал и наличие префикса
  if(msg.channel.type == 'dm') return;
  if(msg.channel.guild.id != config.home) return;
  if(msg.content.substr(0, config.prefix.length) != config.prefix) return;

  const content = msg.content.substr(config.prefix.length).split(/\s+/);

  if(!content.length) return;

  const command = getCommand(content.shift());

  if(!command){
    const embed = new Discord.MessageEmbed()
      .setColor(0xf04747)
      .setDescription('Неизвестная команда. Воспользуйтесь `i!h`');
    return msg.channel.send(embed);
  }

  command.call(msg, content);
});

client.login(config.token);
