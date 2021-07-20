module.exports = {

  emoji : {
    success : '<:success:836658481242832898>',
    error : '<:error:836658737959272520>',

    // Yes, I know this is bad code. But I retard. Then I'll think about it someday
    Sg3 : guild.emojis.cache.get('499315437251723274'),
    Sg0 : guild.emojis.cache.get('499316230172442625'),
  },



  color : {
    success : 0x43b581,
    warning: 0xfaa61a,
    error : 0xf04747,
  },

  /**
   * Прикрепляет к сообщению реакции оценки
   *
   * @param {Message} msg
   */
  opinion : function(msg){
    msg.react(this.emoji.Sg3);
    msg.react(this.emoji.Sg0);
  },

  event : msg => {
    const emojis = msg.content.match(/<:[^:]+:([0-9]+)>/gi);
    if(!emojis) return;
    emojis.forEach(emoji => {
      emoji = msg.guild.emojis.cache.get(emoji.match(/<:[^:]+:([0-9]+)>/i)[1]);
      if(emoji) msg.react(emoji);
    });
  },

  elections : function(msg){
    if(msg.content.startsWith('<@') & msg.content.endsWith('>')){
      msg.react(this.emoji.Sg3);
      msg.react(this.emoji.Sg0);
    };
  }

};
