module.exports = {

  active : true,

  name : 'role',
  short : 'r',
  title : 'Вывод списка команд',
  text : 'Возвращает список доступных команд или описание указанной команды',
  example : '[наименование роли] (ID участника)+',


  /**
   *
   *
   * @param {Message} msg
   * @param {Array}   params Параметры команды
   */
  call : function(msg, params){
    let users = [];
    let role = '';
    let permission = false;

    for(let i = params.length - 1; i >= 0; i--)
      /^[0-9]+$/.test(params[i])
        ? users.push(params[i])
        : role = params[i] + ' ' + role;

    console.log(role);
    console.log(users);

    // Отправка списка доступных игровых ролей
    if(!role.length && !users.length) return this.help(msg);

    if(!this.has(role))
      return permission ? this.create(role) : this.error(msg);

    // Переключение роли пользователю команды
    if(!users.length) return this.toggle(msg, role);

    // Провека наличия прав на выдачу роли
    if(!permission) return this.error(msg);

    // Переключение роли указанным юзерам
    users.forEach(user => this.toggle(msg, role, user));
  },


  /**
   * Отправляет help и список доступных игровых ролей
   *
   * @param {Message} msg
   */
  help : msg => {
    let text = '*... список ...*';

    const embed = new Discord.MessageEmbed()
      .setTitle('Список ролей')
      .setDescription(text);
    msg.channel.send(embed);
  },


  /**
   * Прикрепляет эмодзи ошибки к сообщению пользователя
   * и отправляет help и список доступных игровых ролей
   *
   * @param {Message} msg
   */
  error : function(msg){
    // Прикрепление эмодзи ошибки

    this.help(msg);
  },


  /**
   * Создание роли
   *
   * @param {String} role Название роли
   */
  create : role => {

  },


  /**
   * Проверка существования роли
   *
   * @param {String} role Название роли
   */
  has : role => {

  },


  /**
   * Переключение роли участнику. Если не указан 3 параметр,
   * то выдаёт пользователю команды
   *
   * @param {Message} msg
   * @param {String}  role Название роли
   * @param {Number}  user ID пользователя
   */
  toggle : (msg, role, user) => {

  }

};
