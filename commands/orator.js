module.exports = {

  active : true,
  name : 'orator',
  short : 'o',
  title : 'Младший оратор',
  text : 'Переключает у указанных пользователей роль Младший оратор',
  example : ' [ID участника]+',
  category : 'Роли',


  /**
   * Роль "Младший оратор"
   *
   * @type {Role}
   */
  role : client.guilds.cache.get(config.home).roles.cache.get('809040260582998016'),


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
   * Проверка наличия прав на редактирование прав или наличие роли Оратор
   *
   * @param {Message} msg
   */
  permission : msg =>
    msg.member.hasPermission('MANAGE_ROLES') ||
    msg.member._roles.includes('620194786678407181')

};
