const fetch = require('node-fetch');
const { message } = require('../commands/phishing');

const suggestion1Content = new Discord.MessageEmbed()
  .setColor('BLURPLE')
  .setTitle('Не используйте media.discordapp.net')

module.exports = {

  emoji : {
    success : '<:success:836658481242832898>',
    error : '<:error:836658737959272520>',
		warning : '<:warning:872900968705065070>',

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
    if(msg.content.startsWith('<@') & msg.content.endsWith('>') && msg.content.length < 26){
      msg.react(this.emoji.Sg3);
      msg.react(this.emoji.Sg0);
    };
  },

  closeElections : function(msg){
    if(msg.createdTimestamp > 1631894400){
      const channel = bot.channels.cache.get(612280548777525249)
      channel.send('Приём кандидатов окончен.')
    }
  },

  nsfw : function(msg){
    if(/^[0-9]{2,}$/.test(msg.content)){
      msg.channel.send(`https://nhentai.net/g/${msg.content}/`)
    };
  },

  rule : function(msg){
    
    if(/^(а|a|\d+)(\.\d+)+$/i.test(msg.content) && this.rules[msg.content]){
      msg.channel.send(`https://igc.su/rules?f=${msg.content}`)
    };
  },
  roleFetch : async function(){
    this.rules = await (await fetch('https://igc.su/rules?j=true')).json()
  },

  suggestion1 : function(msg) {
    let mtch = msg.content.match(/https?:\/\/media\.discordapp\.net\/\S+/i)
    if(mtch)
    msg.channel.send(suggestion1Content.setDescription(`Это устаревшая ссылка которая не будет работать на большинстве клиентов.\nВместо этого используйте эту ссылку: ${mtch[0].replace('media.discordapp.net', 'cdn.discordapp.com')}`))
  },
};

module.exports.roleFetch();


