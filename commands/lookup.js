module.exports = {

    active : true,
    name : 'lookup',
    short : 'lu',
    title : 'Пробивка по id',
    text : 'Выдаёт информацию о пользователе или приглашении по id',
    example : '[ID пользователя/кодприглашения]',
    category : 'Утилиты',
  
  
    init : function(){ return this; },

    /**
     *
     *
     * @param {Message} msg
     * @param {Array}   params Параметры команды
     */
    call : function(msg, params){
  
        // Возвращает help для lookup
        if(!params.length && commands.list.help)
            return commands.list.help.call(msg, [this.name]);
        
        const embed = new Global.Discord.MessageEmbed();
        const user = Global.client.users.fetch(params[0]);
        let yOldеtxt = this.timestamp2string(Date.now - user.createdTimestamp);

        if(user){
            embed.setThumbnail(user.avatarURL());
            embed.setTitle(user.tag);
            embed.setAuthor(msg.member.displayName, msg.author.avatarURL());
            embed.addField('Бот?', user.bot ? 'Да' : 'Нет');
            embed.addField('Аккаунт зарегестрирован', yOldеtxt);
            embed.addField('Точная дата:', user.createdAt.toDateString())
        } else {
            msg.channel.send('Пользователь не найден.')
        }
    },

    timestamp2string : function(timestamp){
        let txt;
        if (timestamp < 86400) {txt = 'Сегодня';}
        else if (timestamp < 86400 * 2) {txt = 'Вчера';}
        else if (timestamp < 86400 * 30) {txt = Math.floor(timestamp/86400) + ' ' + num2str(Math.floor(timestamp/86400), ['день', 'дня', 'дней']);}
        else if (timestamp < 86400 * 30 * 12) {txt = Math.floor(timestamp/86400 * 30) + ' ' + num2str(Math.floor(timestamp/86400 * 30), ['месяц', 'месяца', 'месяцев']);}
        else {txt = Math.floor(timestamp/86400 * 30 * 12) + ' ' + num2str(Math.floor(timestamp/86400 * 30 * 12), ['год', 'года', 'лет']);}
        return txt
    }
  };