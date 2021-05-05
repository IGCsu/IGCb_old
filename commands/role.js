module.exports = {

  active : true,

  name : 'role',
  short : 'r',
  title : 'Игровые роли',
  text : 'Используется для работы с ролями:\nНеобходимо указать название роли. Название роли может содержать только латинский символы, а так же "-" и "_". Если роль не будет найдена - она будет создана, при наличии прав.\nПосле роли можно указать пользователей, кому вы хотите переключить роль. Указывать можно вводом ID или упоминанием, разделять нужно пробелом.\nЕсли не указывать пользователей - роль будет переключена у автора команды.',
  example : ' [наименование роли] (ID участника)+',
  category : 'Роли',


  /**
   *
   *
   * @param {Message} msg
   * @param {Array}   params Параметры команды
   */
  call : async function(msg, params){
    const permission = this.permission(msg);
    let users = [];
    let role = '';

    params.forEach(item => {
      const fixed = item.replace(/[^-_\w]/g, '');
      const id = fixed.match(/^[0-9]+$/);

      if(id && id[0].length > 16) return users.push(id[0]);
      if(role.length) role += ' ';
      return role += fixed;
    });

    // Отправка списка доступных игровых ролей
    if(!role.length) return this.help(msg);

    let finded = await this.has(msg, role);

    if(finded.roles.length > 1)
      return this.finded(msg, finded.roles, role);

    finded.role = finded.roles[0];

    if(!finded.role){
      if(!permission)
        return send.error(msg, 'Роль с названием "' + role + '" не найдена');
      finded = await this.create(msg, role, finded.position);
    }

    // Переключение роли пользователю команды
    if(!users.length || (users.length == 1 && users[0] == msg.author.id))
      return toggleRole(msg, finded.role, msg.author.id);

    // Провека наличия прав на выдачу роли
    if(!permission)
      return send.error(msg, 'У вас недостаточно прав для изменения ролей других пользователей');

    // Переключение роли указанным юзерам
    users.forEach(user => toggleRole(msg, finded.role, user));
  },


  /**
   * Отправляет help и отсортированный список доступных игровых ролей
   *
   * @param {Message} msg
   */
  help : function(msg){
    let roles = [];

    msg.guild.roles.cache.forEach(role => {
      if(role.color == 5095913) roles.push(role.name);
    });

    const example = !commands.list.help ? ''
      : commands.list.help.getExample(this);

    const embed = new Discord.MessageEmbed()
      .setTitle('Игровые роли')
      .setDescription(example + '\n' + this.text)
      .addField('Список доступных ролей', roles.sort().join('\n'));
    send.call(msg, embed);
  },


  /**
   * Создание роли
   *
   * @param {Message} msg
   * @param {String}  name Название роли
   * @param {Number}  pos  Позиция роли
   */
  create : async function(msg, name, pos){
    name = name[0].toUpperCase() + name.slice(1);

    const role = await msg.guild.roles.create({
      data : {
        name : name,
        mentionable : true,
        color : 5095913,
        position : pos
      },
      reason : 'По требованию ' + user2name(msg.author)
    });

    send.success(msg, 'Роль ' + name + ' создана');

    return { role : role };
  },


  /**
   * Проверка существования роли. Возвращает найденную роль.
   *
   * @param {Message} msg
   * @param {String}  name Название роли
   */
  has : (msg, name) => {
    name = name.toLowerCase();
    let position = 0;
    let entry = false;

    const roles = msg.guild.roles.cache.filter(r => {
      if(r.color != 5095913) return false;
      if(entry) return false;
      position = r.rawPosition;
      let role = r.name.toLowerCase();
      if(role == name) entry = true;
      return role.includes(name);
    }).array();

    return { position : position, roles : roles };
  },


  /**
   * Отправляет help и отсортированный список доступных игровых ролей
   *
   * @param {Message} msg
   * @param {Array}   roles Список ролей
   * @param {String}  name  Название роли
   */
  finded : (msg, roles, name) => {
    for(let i = 0; i < roles.length; i++) roles[i] = roles[i].name;

    const embed = new Discord.MessageEmbed()
      .setDescription('По запросу "' + name + '" найдено ' +
        roles.length + ' ' + num2str(roles.length, ['роль', 'роли', 'ролей']) +
        '\nУточните ваш запрос.')
      .addField('Список найденных ролей', roles.sort().join('\n'));
    send.error(msg, embed);
  },


  /**
   * Проверка наличия прав на редактирование прав или наличие роли Оратор
   *
   * @param {Message} msg
   */
  permission : msg =>
    msg.member.hasPermission('MANAGE_ROLES') ||
    msg.member._roles.includes('620194786678407181') ||
    msg.member._roles.includes('809040260582998016')

};
