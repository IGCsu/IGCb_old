module.exports = {

  active : true,

  name : 'role',
  short : 'r',
  title : 'Игровые роли',
  text : 'Используется для работы с ролями:\nНеобходимо указать название роли. Название роли может содержать только латинский символы, а так же "-" и "_". Если роль не будет найдена - она будет создана, при наличии прав.\nПосле роли можно указать пользователей, кому вы хотите переключить роль. Указывать можно вводом ID или упоминанием, разделять нужно пробелом.\nЕсли не указывать пользователей - роль будет переключена у автора команды.',
  example : ' [наименование роли] (ID участника)+',
  category : 'Роли',


  init : function(){ return this; },


  /**
   *
   *
   * @param {Message} msg
   * @param {Array}   params Параметры команды
   */
  call : async function(msg, params){
    //return await msg.channel.send('Модуль ролей теперь может быть использован только с помощью /role')
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
    if(!role.length) return send.call(msg, this.help());

    if(!users.length) await msg.channel.send('Эта функция может быть выполнена с помощью /role.\nПопробуйте попользоваться слеш командами в течении какого нибудь времени чтобы привыкнуть к ним.\nВ апреле 2022 большенство ботов перейдёт на такой тип взаимодействия, вы к этому уже будете готовы')

    let finded = await this.has(msg, role);
    let chk

    if(finded.roles.length > 1)
      return this.finded(msg, finded.roles, role);

    finded.role = finded.roles[0];

    if(!finded.role){
      if(!permission)
        return send.error(msg, 'Роль с названием "' + role + '" не найдена');
      finded = await this.create(msg, role, finded.position);
      if(finded.chk) send.success(msg, 'Роль ' + finded.role.name + ' создана');
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
  predict : async function(data){
    let choices = [];

    if (data.data.options[0].focused){
      let role = data.data.options[0].value
      let finded = await this.has({guild: global.guild}, role);
      let predict = finded.roles;
      for(let i = 0; i < predict.length && i < 25; i++) choices[i] = {name : predict[i].name, value : predict[i].id};
    };
    
    interactionRespond.autocompleteResult(data, {choices: choices})
  },

  slash : async function(data){
    const member = guild.member(data.member.user.id);
    const permission = this.permission({member: member})

    if(!data.data.options) return interactionRespond.send(data, {embeds: [this.help()]});

    let role = guild.roles.cache.get(data.data.options[0].value)
    const create = data.data.options.length > 1 ? data.data.options[1].value : undefined;

    
    if(!role) {
      if (permission && create){
        role = await this.create({member: member}, data.data.options[0].value, 45)
        return interactionRespond.send(data, {content: 'Роль <@&' + role.role.id + '> созданна', allowed_mentions: { "parse": [] }})
      } else {
        return interactionRespond.send(data, {content: 'Роль не найдена', allowed_mentions: { "parse": [] }})
      };
    };

    

    let action = { val : 'add', text : 'выдана' };
    if(member.roles.cache.get(role.id))
      action = { val : 'remove', text : 'убрана у' };

    member.roles[action.val](role.id, 'По требованию ' + member2name(member, 1));
    const text = 'Роль <@&' + role.id + '> ' + action.text + ' <@' + member.id + '>';
    return interactionRespond.send(data, {content: text, allowed_mentions: { "parse": [] }});

  },

  /**
   * Отправляет help и отсортированный список доступных игровых ролей
   *
   * @param {Message} msg
   */
  help : function(){
    let roles = [];

    guild.roles.cache.forEach(role => {
      if(role.color == 5095913 || role.color == 3447003 || role.color == 13084411) roles.push(role.name);
    });

    const example = !commands.list.help ? ''
      : commands.list.help.getExample(this);

    const embed = new Discord.MessageEmbed()
      .setTitle('Игровые роли')
      .setDescription(example + '\n' + this.text)
      .setColor('BLURPLE')
      .addField('Список доступных ролей', roles.sort().join('\n'));
    return embed;
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

    const role = await guild.roles.create({
      data : {
        name : name,
        mentionable : true,
        color : 5095913,
        position : pos
      },
      reason : 'По требованию ' + member2name(msg.member, 1)
    });
    return { role : role , chk: true};
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
      if(!(r.color == 5095913 || r.color == 3447003 || r.color == 13084411)) return false;
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
