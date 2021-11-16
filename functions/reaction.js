const fetch = require('node-fetch');
const { message } = require('../commands/phishing');

const suggestion1Content = new Discord.MessageEmbed()
  .setColor('BLURPLE')
  .setTitle('Не используйте media.discordapp.net')

module.exports = {

  emoji : {
    success : '<:done:905609029282304051>',
    error : '<:error:905609067106553886>',
		warning : '<:warning:872900968705065070>',
    loading : '<a:loading:905609086257754152>',

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
  opinion : async function(msg){
    await msg.react(this.emoji.Sg3);
    await msg.react(this.emoji.Sg0);
  },

  event : async function(msg){
    const emojis = msg.content.match(/<:[^:]+:([0-9]+)>/gi);
    if(!emojis) return;
    emojis.forEach(async emoji => {
      emoji = msg.guild.emojis.cache.get(emoji.match(/<:[^:]+:([0-9]+)>/i)[1]);
      if(emoji) await msg.react(emoji);
    });
  },

  elections : async function(msg){
    if(msg.content.startsWith('<@') & msg.content.endsWith('>') && msg.content.length < 26){
      await msg.react(this.emoji.Sg3);
      await msg.react(this.emoji.Sg0);
    };
  },

  closeElections : async function(msg){
    if(msg.createdTimestamp > 1631894400){
      const channel = bot.channels.cache.get(612280548777525249)
      await channel.send({ content : 'Приём кандидатов окончен.' })
    }
  },

  nsfw : async function(msg){
    if(/^[0-9]{2,}$/.test(msg.content)){
      await msg.channel.send({content: `<@!${msg.author.id}>: https://nhentai.net/g/${msg.content}/`, allowedMentions:{parse:[]}});
      await msg.delete()
    };
  },

  rule : async function(msg){

    if(/^(а|a|\d+)(\.\d+)+$/i.test(msg.content) && this.rules[msg.content]){
      await msg.channel.send({ content : `https://igc.su/rules?f=${msg.content}` })
    };
  },
  roleFetch : async function(){
    this.rules = await (await fetch('https://igc.su/rules?j=true')).json()
  },

  // suggestion1 : async function(msg) {
  //   let mtch = msg.content.match(/https?:\/\/media\.discordapp\.net\/\S+((\.webm)|(\.mp4))/i)
  //   if(mtch){
  //     const emb = suggestion1Content.setDescription(`Это устаревшая ссылка которая не будет работать на большинстве клиентов.\nВместо этого используйте эту ссылку: ${mtch[0].replace('media.discordapp.net', 'cdn.discordapp.com')}`).toJSON();
  //     my_msg = await msg.channel.send(
  //     {
  //       embed: emb,
  //       components:
  //       [
  //         {
  //           type: 1,
  //           components:
  //           [
  //             {
  //               type: 2,
  //               label: 'Исправить',
  //               style: 3,
  //               custom_id: `correct|${msg.id}|${msg.author.id}`
  //             },
  //             {
  //               type: 2,
  //               label: 'Убрать',
  //               style: 2,
  //               custom_id: `dismiss|${msg.id}`
  //             },
  //             {
  //               type: 2,
  //               label: 'Удалить',
  //               style: 4,
  //               custom_id: `deleteOriginal|${msg.id}|${msg.author.id}`
  //             }
  //           ]
  //         }
  //       ],
  //       allowed_mentions: {parse: []}
  //     })
  //   };
  // },

  button1: async function(button, param){
    const msg = (await client.channels.cache.get(button.message.channel.id).messages.fetch(param[1]))
    if(msg.content.match(/https?:\/\/media\.discordapp\.net\/\S+/i)){
      button.reply.send({content:'Сообщение всё ещё содержит неверную ссылку.\nИсправте сообщение и попробуйте снова', flags: 64})
    } else {
      button.reply.send({content:'Спасибо за уважение участников сервера!', flags: 64})
      await button.message.delete();
    };
  },

  button2: async function(button, param){
    const msg = (await client.channels.cache.get(button.message.channel.id).messages.fetch(param[1]))
    await msg.delete();
    button.reply.send({content:'Сообщение с неверной ссылкой удалено!', flags: 64})
    await button.message.delete();

  },

  button3: async function(button, param){
    const msg = (await client.channels.cache.get(button.message.channel.id).messages.fetch(param[1]))
    if (button.clicker.id != param[2]) return button.reply.send({content:'Исправить сообщение может только автор сообщения!', flags: 64});
    await msg.delete();
    button.reply.send({content:'Сообщение с неверной ссылкой заменено!', flags: 64});
    await button.message.edit({content: `<@${param[2]}>: ` + msg.content.replace('media.discordapp.net', 'cdn.discordapp.com'), components: [], allowed_mentions: {parse: []}});

  },

  suggestion2 : async function(msg) {
    let mtch = msg.content.match(/https?:\/\/media\.discordapp\.net\/\S+((\.webm)|(\.mp4))/i);
    if(mtch){
      await msg.delete();
      await msg.channel.send({content: `<@${msg.author.id}>: ` + msg.content.replace('media.discordapp.net', 'cdn.discordapp.com'), components: [], allowed_mentions: {parse: []}});

    }
  }

};

module.exports.roleFetch();
