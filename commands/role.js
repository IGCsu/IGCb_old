const getExample = require('./help').getExample;

module.exports = {

  active : true,

  name : 'role',
  short : 'r',
  title : 'Игровые роли',
  text : 'Используется для работы с ролями:\nНеобходимо указать название роли. Если роль не будет найдена - она будет создана, при наличии прав.\nПосле роли необходимо указать пользователей, кому вы хотите переключить роль. Указывать можно вводом ID или упоминанием, разделять нужно пробелом.\nЕсли не указывать пользователей - роль будет переключена у автора команды.',
  example : '[наименование роли] (ID участника)+',


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
      const id = item.match(/^(<@!?)?([0-9]+)(>)?$/);
      if(id) return users.push(id[2]);
      if(role.length) role += ' ';
      role += item;
    });

    // Отправка списка доступных игровых ролей
    if(!role.length) return this.help(msg);

    let finded = await this.has(msg, role);

    if(!finded.role){
      if(!permission)
        return this.error(msg, 'Роль с названием "' + role + '" не найдена');
      finded = await this.create(msg, role, finded.position);
    }

    // Переключение роли пользователю команды
    if(!users.length || users[0] == msg.author.id)
      return this.toggle(msg, finded.role, msg.author.id);

    // Провека наличия прав на выдачу роли
    if(!permission)
      return this.error(msg, 'У вас недостаточно прав для изменения ролей других пользователей');

    // Переключение роли указанным юзерам
    users.forEach(user => this.toggle(msg, finded.role, user));
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

    const embed = new Discord.MessageEmbed()
      .setTitle('Игровые роли')
      .setDescription(getExample(this) + '\n' + this.text)
      .addField('Список доступных ролей', roles.sort().join('\n'));
    msg.channel.send(embed);
  },


  /**
   * Прикрепляет эмодзи ошибки к сообщению пользователя
   * и отправляет информацию об ошибке
   *
   * @param {Message} msg
   * @param {String}  name Текст ошибки
   */
  error : (msg, text) => {
    msg.channel.send(text);
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
      reason : 'По требованию уполномочегонного лица'
    });

    msg.channel.send('Роль ' + name + ' создана');

    return { role : role };
  },


  /**
   * Проверка существования роли. Возвращает найденную роль
   *
   * @param {Message} msg
   * @param {String}  name Название роли
   */
  has : (msg, name) => {
    name = name.toLowerCase();
    let position = 0;

    const role = msg.guild.roles.cache.find(r => {
      if(r.color != 5095913) return false;
      position = r.rawPosition;
      return r.name.toLowerCase() == name;
    });

    return { position : position, role : role };
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
      return this.error(msg, 'Пользователь с ID:' + user + ' не найден');

    let action = { val : 'add', text : 'выдана' };
    if(member._roles.includes(role.id))
      action = { val : 'remove', text : 'убрана у' }

    member.roles[action.val](role, 'По требованию уполномочегонного лица');
    msg.channel.send('Роль ' + role.name + ' ' + action.text + ' ' +
      member.user.username + '#' + member.user.discriminator);
  },


  permission : msg =>
    msg.member.hasPermission('MANAGE_ROLES') ||
    msg.member._roles.includes('620194786678407181')

};
