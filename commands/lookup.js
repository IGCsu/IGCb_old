module.exports = {

  active : true,
  name : 'lookup',
  short : 'lu',
  title : 'Информация по id',
  text : 'Выдаёт информацию о пользователе или приглашении по id',
  example : ' [ID пользователя/кодприглашения]',
  category : 'Утилиты',


  init : function(){ return this; },

  /**
  * @param {Message} msg
  * @param {Array}   params Параметры команды
  */
  call : async function(msg, params){

    if(!params.length && commands.list.help)
      return commands.list.help.call(msg, [this.name]);

    const user = await client.users.fetch(params[0]);

    if(!user)
      return send.error(msg, 'Пользователь не найден');

    const old = this.getDateFromNow(Date.now() - user.createdTimestamp);
    const embed = new Discord.MessageEmbed()
      .setThumbnail(user.avatarURL())
      .setTitle(user.tag)
      .setAuthor(msg.member.displayName, msg.author.avatarURL())
      .addField('Бот: ', user.bot ? 'Да' : 'Нет')
      .addField('Аккаунт зарегестрирован: ', old)
      .addField('Точная дата: ', user.createdAt.toDateString());

    send.call(msg, embed);
  },


  dateText : {
    hours : ['час', 'часа', 'часов'],
    minutes : ['минуту', 'минуты', 'минут'],
    days : ['день', 'дня', 'дней'],
    month : ['месяц', 'месяца', 'месяцев'],
    year : ['год', 'года', 'лет']
  },


  /**
   * Получение разницы меж датами
   *
   * @param  Number difference Разница во времени
   * @return String
   */
  getDateFromNow : function(difference){
    difference = difference / 1000;

    const minutes = Math.round( (difference/60) % 60 );
    const hours = Math.round( (difference/3600) % 24 );
    const days = Math.round(difference/86400);
    const month = +(days/30).toFixed(1);
    const year = +(days/365).toFixed(1);

    if(days == 0){
      if(hours > 0) return hours + ' ' + num2str(hours, this.dateText.hours) + ' назад';
      if(minutes > 0) return minutes + ' ' + num2str(minutes, this.dateText.minutes) + ' назад';
      return 'меньше минуты назад...';
    }

    let value = days + ' ' + num2str(days, this.dateText.days) + ' назад';

    if(year >= 1)
      return value + ' ~ ' + year + ' ' + num2str(year, this.dateText.year) + ' назад';
    if(month >= 1)
      return value + ' ~ ' + month + ' ' + num2str(month, this.dateText.month) + ' назад';

    return value;
  }
};
