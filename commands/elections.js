const Buffer = require('buffer');

module.exports = {

  active : true,
  name : 'elections',
  short : 'e',
  title : 'Сбор данных',
  text : 'Собирает данные с выборов по указанному числу сообщений',
  example : ' [Количество сообщений]',
  category : 'Выборы',

  agree_r_id : '499315437251723274',
  disagree_r_id :'499316230172442625',
  chat_id : '612280548777525249',

  agree_state : '<:done_2:764938637862371348>',
  disagree_state : '<:error_2:837961320107212810> ',
  loading_state : '<a:Loading_emoji_02:830796791837491210>',

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
    let counterView = 0;

    //TODO Сделать так чтобы эти промисы возвращали объект сообщения.
    let messState = msg.channel.send(this.loading_state).then();
    let messView = msg.channel.send('Собираю данные').then();
    //console.log(messView)

    const msg_count = params[0];

    const messages = await msg.guild.channels.cache.get(this.chat_id).messages.fetch({limit: msg_count});

    for(let message of messages.values())
      await this.getStatmentData(message, data);
      //counterView += 1;
      //await messView.edit(`Собираю данные\nПроверено ${counterView}/${msg_count} кандидатов`)

    await fs.writeFile('elections.json', JSON.stringify(data), err => {
      if(err) return console.log(err);
    });

    //await messState.edit(this.agree_state);
    //await messView.delete();
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
