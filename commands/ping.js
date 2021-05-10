module.exports = {

  active : true,
  name : 'ping',
  short : 'p',
  title : 'Пинг',
  text : 'Информация о боте: пинг, uptime',
  example : '',


  init : function(){ return this; },


  /**
   *
   *
   * @param {Message} msg
   */
  call : function(msg){

    let uptime = client.uptime / 1000;

    uptime = [
      Math.floor(uptime / 3600).toString().padStart(2, '0'),
      Math.floor(uptime % 3600 / 60).toString().padStart(2, '0'),
      Math.floor(uptime % 3600 % 60).toString().padStart(2, '0')
    ];

    const ping = Date.now() - msg.createdTimestamp;

    const embed = new Discord.MessageEmbed()
      .setTitle('Pong!')
      .setDescription('`' + ping + 'ms` Uptime: ' + uptime.join(':'));

    if(ping < 160)
      return send.success(msg, embed);

    if(ping < 160)
      return send.warning(msg, embed);

    return send.error(msg, embed);
  }

};
