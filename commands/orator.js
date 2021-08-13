module.exports = {

  active : true,
  name : 'orator',
  short : 'o',
  title : 'Младший оратор',
  text : 'Переключает у указанных пользователей роль Младший оратор',
  example : ' [ID участника]+',
  category : 'Роли',


  init : function(){ return this; },


  /**
   * Роль "Младший оратор"
   *
   * @type {Role}
   */
  role : guild.roles.cache.get('809040260582998016'),


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

    if(!this.permission(msg.member))
      return send.error(msg, 'У вас недостаточно прав для изменения ролей других пользователей');

    let users = [];

    params.forEach(item => {
      const id = item.match(/^(<@!?)?([0-9]+)(>)?$/);
      if(id) return users.push(id[2]);
    });

    users.forEach(user => toggleRole(msg, this.role, user));

  },

  context : function(data){

    const guild = client.guilds.cache.get(data.guild_id);
    const member = guild.member(data.member.user.id);

    if(!this.permission(member))
      return interactionRespond.send(data, {flags: 64, content: 'У вас недостаточно прав для изменения ролей других пользователей'});

    const targetId = data.data.target_id;

		return interactionRespond.send(data, {flags: 64, content: toggleRole({guild: guild, member: member}, this.role, targetId, true)});
  },


  /**
   * Проверка наличия прав на редактирование прав или наличие роли Оратор
   *
   * @param {Member} member
   */
  permission : member =>
    member.hasPermission('MANAGE_ROLES') ||
    member._roles.includes('620194786678407181')

};
