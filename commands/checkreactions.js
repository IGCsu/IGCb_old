const member2name = require("../functions/member2name");

module.exports = {

    active : true,
    name : 'checkreactions',
    short : 'chr',
    title : 'Сбор данных',
    text : 'Собирает данные с выборов по указанному числу сообщений',
    example : ' [Количество сообщений], [Канал]',
    category : 'Выборы',
    
    agree_r_id : '499315437251723274',
    disagree_r_id :'499316230172442625',
  
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
        const chan_id = params[1].match(/^(<@&)?([0-9]+)(>)?$/);

        if(!chan_id) chan_id = '612280548777525249';

        const messages = await msg.channel.messages.fetch({limit: msg_count});

        for(let i = 0; i <= messages.length; i++)
            this.getStatmentData(messages[i], data);

        const json_data = JSON.stringify(data);

        const attachment = new Discord.MessageAttachment(json_data);

        msg.channel.send("Сбор данных завершён!", attachment)

    },

    getStatmentData : function(msg, data){
        const agree_r = msg.reactions.cache.get(this.agree_r_id);
        const disagree_r = msg.reactions.cache.get(this.disagree_r_id);

        const member = msg.guild.member(msg.content.match(/^(<@!?)?([0-9]+)(>)?$/));
        const agree_users_array = this.getReactionData(agree_r);
        const disagree_users_array = this.getReactionData(disagree_r);

        data[member.user.id] = {
            name : member2name(member, 1), 
            "1" : this.getReactionData(agree_r),
            "0" : this.getReactionData(disagree_r)
        };
        
    },
    
    getReactionData : function(reaction){
        let data = {};
        reaction.users.cache.each(user => {
            data[user.id] = member2name(reaction.message.guild.member(user.id))
        });
        return data;
    },
  
    /**
     *  Проверка наличия прав на редактирование прав или наличие роли Оратор
     *
     *  @param {Message} msg
     */
    permission : msg =>
        msg.member.id == '500020124515041283' ||
        msg.member._roles.includes('613412133715312641')
  
  };