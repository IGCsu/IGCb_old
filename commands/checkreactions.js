module.exports = {

    active : true,
    name : 'checkreactions',
    short : 'chr',
    title : 'Сбор данных',
    text : 'Собирает данные с выборов по указанному числу сообщений',
    example : ' [Количество сообщений], [Канал]',
    category : 'Выборы',
  
  
    init : function(){ return this; },
  
  
    /**
     *
     *
     *  @param {Message} msg
     *  @param {Array}   params Параметры команды
     */
    call : function(msg, params){
  
        if(!params.length && commands.list.help)
            return commands.list.help.call(msg, [this.name]);
  
        if(!this.permission(msg))
            return send.error(msg, 'У вас недостаточно прав для использования данной комманды');
  
        
        const agree_r_id = '499315437251723274'
        const disagree_r_id ='499316230172442625'

        let data = [];
        
        const msg_count = params[0];
        const chan_id = params[1].match(/^(<@&)?([0-9]+)(>)?$/);

        if(!chan_id) chan_id = '612280548777525249';

        let messages = msg.channel.messages.fetch({limit: msg_count});

        for(let i = 0; i <= messages.length; i++){
            data.push(this.getStatmentData(msg, [agree_r_id, disagree_r_id]))
        };


    },

    getStatmentData : function(msg, reactions_ids){
        const memb_id = msg.content.match(/^(<@!?)?([0-9]+)(>)?$/);

    },
    
    getReactionData : function(msg, reaction){

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