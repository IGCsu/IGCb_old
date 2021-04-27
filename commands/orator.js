module.exports = {

    active : true,
    name : 'orator',
    short : 'o',
    title : 'Младший оратор',
    text : 'Выдаёт/заберает у указанного пользователя роль Младший оратор',
    example : '(command)',


    /**
   *
   *
   * @param {Message} msg
   * @param {Array}   params Параметры команды
   */
  call : async function(msg, params){
    const permission = this.permission(msg);
    let users = [];
    const role = msg.guild.roles.cache.get(809040260582998016);

    params.forEach(item => {
      const id = item.match(/^(<@!?)?([0-9]+)(>)?$/);
      if(id) return users.push(id[2]);
      
    });
    if(!permission)
      return send.error(msg, 'У вас недостаточно прав для изменения ролей других пользователей');
    
    users.forEach(user => this.toggle(msg, role, user));

    },


    /**
   * Переключение роли участнику.
   *
   * @param {Message} msg
   * @param {Role}    role
   * @param {Number}  user ID пользователя
   */
  toggle : function(msg, role, user){
    const member = msg.guild.member(user);

    if(!member)
      return send.error(msg, 'Пользователь с ID:' + user + ' не найден');

    let action = { val : 'add', text : 'выдана' };
    if(member._roles.includes(role.id))
      action = { val : 'remove', text : 'убрана у' }

    member.roles[action.val](role, 'По требованию уполномочегонного лица');
    send.success(msg, 'Роль ' + role.name + ' ' + action.text + ' ' +
      member.user.username + '#' + member.user.discriminator);
  },

  /**
   * Проверка наличия прав
   *
   * @param {Message} msg
   */
   permission : msg =>
   msg.member.hasPermission('MANAGE_ROLES')

};