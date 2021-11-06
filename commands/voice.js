module.exports = {

  active : true,

  name : 'voice',
  short : 'v',
  title : 'Управление каналами',
  text : 'Модуль для управления каналами. Команда используется для инициализации стартового канала или для сброса сохранённых прав.\nДля того, чтобы создать собственный голосовой канал, нужно зайти в "Создать канал". После чего, бот создаст ваш канал и перебросит вас туда. В этом канале у вас будут все привилегии, вы можете полностью управлять собственным каналом и назначать туда любые права. \nПосле выхода из канала всех участников, канал будет удалён, однако все указанные привилегии будут сохранены и указаны, когда вы вновь создадите свой канал.\n\nЕсли вы случайно удалили собственные права, или у вас возникли иные проблемы, для вас есть 2 команды:\n`fix/f` - Возвращает все права в вашем канале. Рекомендуется использовать, если ваши права в канале были удалены;\n`reset/r` - Удаляет ваш канал и все настройки, включая права, название и тп. Иными словами - полный сброс. Рекомендуется использовать, если вы окончательно всё сломали с настройками и хотите их сбросить.',
  example : ' ( <reset/r> | <fix/f> )',


  /**
   * Права для канала
   *
   * @type {Object}
   */
  permission : {
    MANAGE_CHANNELS : true,
    DEAFEN_MEMBERS : true,
    MUTE_MEMBERS : true,
    MOVE_MEMBERS : true,
    VIEW_CHANNEL : true,
    MANAGE_ROLES : true,
    CONNECT : true,
    STREAM : true,
    SPEAK : true,
  },


  /**
   * Инициализирует прослушку необходимых ивентов.
   * Находит категорию голосовых и #Создать канал. Создаёт его, если не находит.
   *
   * @return {Object}
   */
  init : function(){
    client.on('channelDelete', channel => this.save(channel));
    client.on('voiceStateUpdate', (before, after) => this.update(before, after));

    let channel, category;

    client.channels.cache.array().forEach(c => {
      if(c.type != 'voice' && c.type != 'category') return;
      if(c.name == 'Создать канал') return channel = c;
      if(c.name == 'Голосовые') return category = c;
      if(!(c.members.array().filter(m => !m.user.bot).length) && c.type == 'voice'){
        log.info(null, 'delete', '#' + c.name);
        return c.delete();
      }
    });

    if(!channel) channel = this.channelCreate(category);

    this.channel = channel;
    this.categoryChannel = category;

    return this;
  },


  /**
   * Создаёт #Создать канал
   *
   * @param {CategoryChannel} category
   */
  channelCreate : async category => await guild.channels.create('Создать канал', {
    parent : category.id,
    type : 'voice'
  }),


  /**
   * Отправляет информацию
   *
   * @param {Message} msg
   * @param {Array}   params Параметры команды
   */
  call : function(msg, params){
    if(params[0] == 'reset' || params[0] == 'r') return this.reset(msg);
    if(params[0] == 'fix' || params[0] == 'f') return this.fix(msg);
    return commands.list.help.call(msg, ['voice']);
  },

  slash : function(int){
    let msg = getMsg(int);
    const params = int.data.options[0].name;
    if(params == 'reset') return this.reset(msg);
    if(params == 'fix') return this.fix(msg);
    return commands.list.help.call(msg, ['voice']);
  },

  /**
   * Удаляет конфигурацию о пользовтаеле из базы
   *
   * @param {Message} msg
   */
  reset : function(msg){
    const user = DB.query('SELECT * FROM users WHERE id = ?', [msg.member.user.id]);
    DB.query('DELETE FROM users WHERE id = ?', [msg.member.user.id]);
    msg.isSlash
			? interactionRespond.send(msg.interaction, {content : reaction.emoji.success + ' Настройки сброшены', flags: 64})
			: send.success(msg, 'Настройки сброшены');
    
    if(!user.length) return;

    const permission = this.channel.permissionOverwrites.get(user[0].id);
    if(permission) permission.delete();
    const voice = msg.guild.channels.cache.get(user[0].voice_id);
    if(voice) voice.delete();
    const text = msg.guild.channels.cache.get(user[0].text_id);
    if(text) text.delete();
  },


  /**
   * Даёт пользователю все права в его собственном канале
   *
   * @param {Message} msg
   */
  fix : function(msg){
    const user = DB.query('SELECT * FROM users WHERE id = ?', [msg.member.user.id]);
    msg.isSlash
			? interactionRespond.send(msg.interaction, {content : reaction.emoji.success + ' Права исправлены', flags: 64})
			: send.success(msg, 'Права исправлены');
    
    if(!user.length) return;

    const voice = msg.guild.channels.cache.get(user[0].voice_id);
    if(voice) voice.updateOverwrite(msg.member, this.permission);
    const text = msg.guild.channels.cache.get(user[0].text_id);
    if(text) text.updateOverwrite(msg.member, { VIEW_CHANNEL : true });
  },


  /**
   * Функция прослушки ивента обновления.
   * Если пользователь находиться в #Создать канал - создаётся персональный канал.
   * Если пользователь вышел из канала и в нём никого нет, кроме ботов - канал удаляется.
   *
   * @param {VoiceState} before Предыдущий канал
   * @param {VoiceState} after  Текущий канал
   */
  update : function(before, after){
    const state = after.channel ? after : before;
    const channel = {
      before : before.channel ? before.channel : { name : 'X' },
      after : after.channel ? after.channel : { name : 'X' },
    };

    if(channel.before.id == channel.after.id) return;

    log.info(member2name(state.member, 1, 1), 'voiceState', channel.before.name + ' => ' + channel.after.name);

    if(state.member.user.bot) return; // проверка на бота

    if(channel.after.id == this.channel.id)
      return this.create(after);
    else if(after.channel) this.textUpdate(after, true);

    if(!before.channel) return;
    if(channel.before.id == this.channel.id) return;

    if(before.channel.members.array().filter(m => !m.user.bot).length)
      return this.textUpdate(before, false);

    log.info(member2name(before.member, 1, 1), 'delete', '#' + before.channel.name);
    before.channel.delete();
  },


  /**
   * Создание канала
   * Есть проверка на существование канала, в положительном случае - перекидывает в уже существующий канал.
   * Если есть сохранённая конфигурация - выставляет её.
   * Блокирует возможность присоединяться к #Создать канал
   *
   * @param {VoiceState} data
   */
  create : async function(data){
    let user = DB.query('SELECT * FROM users WHERE id = ?', [data.member.user.id]);

    if(user.length){
      const channel = data.guild.channels.cache.get(user[0].voice_id);
      if(channel) return data.setChannel(channel);
    }

    let voice = user.length ? JSON.parse(user[0].voice_data) : this.new(data);
    let options = {
      reason : 'По требованию ' + member2name(data.member, 1),
      parent : this.categoryChannel.id,
      type : 'voice'
    };

    if(voice.bitrate) options.bitrate = voice.bitrate;
    if(voice.permissionOverwrites) options.permissionOverwrites = voice.permissionOverwrites;
    if(voice.userLimit) options.userLimit = voice.userLimit;

    log.info(member2name(data.member, 1, 1), 'create', '#' + voice.name);
    const channel = await data.guild.channels.create(voice.name, options);

    data.setChannel(channel).catch(reason => channel.delete());
    this.channel.updateOverwrite(data.member, { CONNECT : false });

    channel.updateOverwrite(data.member, this.permission);
    const text = await data.guild.channels.create('немым', {
      reason : 'По требованию ' + member2name(data.member, 1),
      parent : this.categoryChannel.id,
      permissionOverwrites : [{
        id : everyone,
        allow : [],
        deny : ['VIEW_CHANNEL'],
        type : 'role'
      },{
        id : data.member.user.id,
        allow : ['VIEW_CHANNEL'],
        deny : [],
        type : 'member'
      }],
      type : 'text',
    });

    DB.query('UPDATE users SET voice_id = ?, text_id = ? WHERE id = ?', [
      channel.id, text.id, data.member.user.id,
    ]);
  },


  /**
   * Добавляет информацию о пользователе в базу и создаёт базовую конфигурацию канал
   *
   * @param  {VoiceState} data
   * @return {Object}          Конфигурация канала
   */
  new : function(data){
    const voice = { name : member2name(data.member) };

    DB.query('INSERT INTO users (id, voice_data) VALUES (?, ?)', [
      data.member.user.id, JSON.stringify(voice)
    ]);

    return voice;
  },


  /**
   * Сохраняет конфигурацию канала в базу.
   * Открывает доступ в #Создать канал
   *
   * @param {VoiceChannel} channel Удалённый канал
   */
  save : async function(channel){
    const user = DB.query('SELECT * FROM users WHERE voice_id = ?', [channel.id]);
    if(user.length){
      const permission = this.channel.permissionOverwrites.get(user[0].id);
      if(permission) permission.delete();
      const text = channel.guild.channels.cache.get(user[0].text_id);
      if(text) text.delete();
    }

    const voice = {
      name : channel.name,
      permissionOverwrites : channel.permissionOverwrites,
      userLimit : channel.userLimit,
      bitrate : channel.bitrate
    };

    DB.query('UPDATE users SET voice_id = ?, text_id = ?, voice_data = ? WHERE voice_id = ?', [
      0, 0, JSON.stringify(voice), channel.id
    ]);
  },


  /**
   *
   *
   * @param {VoiceState} data
   */
  textUpdate : function(data, action){
    const user = DB.query('SELECT * FROM users WHERE voice_id = ?', [data.channel.id]);

    if(!user.length) return;
    if(!user[0].text_id) return;

    const channel = data.guild.channels.cache.get(user[0].text_id);
    if(!channel) return;

    channel.updateOverwrite(data.member, { VIEW_CHANNEL : action });
  }

};
