module.exports = {

  active : true,
  name : 'alive',
  short : 'a',
  title : 'Ключ к вратам через буффер',
  text : 'Переключает у указанных пользователей роль alive',
  example : '[ID участника]+',


  /**
   * Роль "Alive"
   *
   * @type {Role}
   */
  role : client.guilds.cache.get(config.home).roles.cache.get('648762974277992448'),


  /**
   *
   *
   * @param {Message} msg
   * @param {Array}   params Параметры команды
   */
  call : function(msg, params){

    // Возвращает help для role
    if(!params.length && commands.list.help)
      return commands.list.help.call(msg, [this.name]);

    if(!this.permission(msg))
      return send.error(msg, 'У вас недостаточно прав для изменения ролей других пользователей');

    let users = [];

    params.forEach(item => {
      const id = item.match(/^(<@!?)?([0-9]+)(>)?$/);
      if(id) return users.push(id[2]);
    });

    users.forEach(user => toggleRole(msg, this.role, user));
  },


  /**
   * Проверка наличия роли Сенат
   *
   * @param {Message} msg
   */
  permission : msg => msg.member._roles.includes('613412133715312641')

};
