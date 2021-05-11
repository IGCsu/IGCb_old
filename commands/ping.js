module.exports = {

  active : true,
  name : 'ping',
  short : 'p',
  title : 'Пинг',
  text : 'Информация о боте: пинг, uptime. Пинг высчитывается с момента отправки вашего, до момента отправки сообщения бота. Время вычисления не учитывается.',
  example : '',


  init : function(){ return this; },


  embed : new Discord.MessageEmbed().setDescription('вычисление... '),


  /**
   *
   *
   * @param {Message} msg
   */
  call : function(msg){
    msg.channel.send(this.embed).then(m => {
      const ping = m.createdTimestamp - msg.createdTimestamp;

      let uptime = client.uptime / 1000;

      uptime = [
        Math.floor(uptime / 3600).toString().padStart(2, '0'),
        Math.floor(uptime % 3600 / 60).toString().padStart(2, '0'),
        Math.floor(uptime % 3600 % 60).toString().padStart(2, '0')
      ];

      const embed = new Discord.MessageEmbed()
        .setTitle('Pong!')
        .setDescription('`' + ping + 'ms` Uptime: ' + uptime.join(':') + '\n' + this.text)
        .setColor(reaction.color[ping < 260 ? 'success' : 'error']);

      m.edit(embed);
    });
  },

};
