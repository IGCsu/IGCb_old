const Buffer = require('buffer');

module.exports = {

  active : true,
  name : 'checkreactions',
  short : 'chr',
  title : 'Сбор данных',
  text : 'Собирает данные с выборов по указанному числу сообщений',
  example : ' [Количество сообщений]',
  category : 'Выборы',

  agree_r_id : '499315437251723274',
  disagree_r_id :'499316230172442625',
  chat_id : '612280548777525249',

  init : function(){ return this; },


  /**
   *
   *
   *  @param {Message} msg
   *  @param {Array}   params Параметры команды
   */
  call : async function(msg, params){

    if(!params.length && commands.list.help)
      return commands.list.help.call(msg, [this.name]);

    if(!this.permission(msg))
      return send.error(msg, 'У вас недостаточно прав для использования данной комманды');

    let data = {};

    const msg_count = params[0];

    const messages = await msg.guild.channels.cache.get(this.chat_id).messages.fetch({limit: msg_count});

    for(let message of messages.values())
      await this.getStatmentData(message, data);

    await fs.writeFile('elections.json', JSON.stringify(data), err => {
      if(err) return console.log(err);
    });

    msg.channel.send('Сбор данных завершён!', new Discord.MessageAttachment('./elections.json'));
  },

  getStatmentData : async function(msg, data){
    const agree_r = msg.reactions.cache.get(this.agree_r_id);
    const disagree_r = msg.reactions.cache.get(this.disagree_r_id);

    if(!disagree_r) return;
    if(!agree_r) return;

    const match = msg.content.match(/^(<@!?)?([0-9]+)(>)?$/);
    if(!match[2]) return;

    const member = msg.guild.member(match[2]);
    if(!member) return;

    data[member.user.id] = {
      name : member2name(member, 1),
      '1' : await this.getReactionData(agree_r),
      '0' : await this.getReactionData(disagree_r)
    };

  },

  getReactionData : async function(reaction){
    let data = {};
    const users = await reaction.users.fetch();

    users.each(user => {
      const member = reaction.message.guild.member(user.id);
      if(!member) return;
      data[user.id] = member2name(member);
    });

    return data;
  },

  /**
   *  Проверка наличия прав на редактирование прав или наличие роли Оратор
   *
   *  @param {Message} msg
   */
  permission : msg =>
    msg.member.id == '500020124515041283' || msg.member.id == '256114365894230018'

};
