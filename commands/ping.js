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
  call : async function(msg){
    m = await msg.channel.send({embeds : [this.embed] });
    if(msg.isSlash) interactionRespond.defSend(msg.interaction);
    let ping = (m.createdTimestamp - msg.createdTimestamp)/ 2;

    const embed = new Discord.MessageEmbed()
      .setTitle('Pong!')
      .setDescription('`' + ping + 'ms` Uptime: <t:' + Math.floor((m.createdTimestamp - client.uptime)/1000) + ':R>\n' + this.text)
      .setColor(reaction.color[ping < 260 ? 'success' : 'error']);

      if(msg.isSlash){
        await m.delete();
        interactionRespond.editOriginal(msg.interaction, {embeds: [embed]})
      } else {
        await m.edit({embeds: [embed]});
      }
  },

  slash : async function(int){
    msg = getMsg(int);
    await this.call(msg)
  }

};
