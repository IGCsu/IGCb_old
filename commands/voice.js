module.exports = {

  active : true,

  name : 'voice',
  short : 'v',
  title : 'Управление каналами',
  text : 'Модуль для управления каналами. Команда используется для инициализации стартового канала или для сброса сохранённых прав.\nДля того, чтобы создать собственный голосовой канал, нужно зайти в "Создать канал". После чего, бот создаст ваш канал и перебросит вас туда. В этом канале у вас будут все привилегии, вы можете полностью управлять собственным каналом и назначать туда любые права. \nПосле выхода из канала всех участников, канал будет удалён, однако все указанные привилегии будут сохранены и указаны, когда вы вновь создадите свой канал.',
  example : '',


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
    });

    if(!channel) channel = this.channelCreate(category);

    this.channel = channel;
    this.categoryChannel = category;

    return this;
  },


  /**
   * Создаёт #Создать канал
   *
   * @param  {CategoryChannel} category
   */
  channelCreate : async category => await client.guilds.cache.get(config.home)
    .channels.create('Создать канал', { parent : category.id, type : 'voice' }),


  /**
   * Отправляет информацию
   *
   * @param  {Message} msg
   */
  call : msg => commands.list.help.call(msg, ['voice']),


  /**
   * Функция прослушки ивента обновления.
   * Если пользователь находиться в #Создать канал - создаётся персональный канал.
   * Если пользователь вышел из канала и в нём никого нет, кроме ботов - канал удаляется.
   *
   * @param  {VoiceState} before Предыдущий канал
   * @param  {VoiceState} after  Текущий канал
   */
  update : function(before, after){
    const data = after.channel ? after : before;
    log.info(user2name(data.member.user), 'voiceState', '#' + data.channel.name);
    if(after.channel && after.channel.id == this.channel.id)
      return this.create(after);

    if(!before.channel) return;
    if(before.channel.id == this.channel.id) return;
    if(before.channel.members.array().filter(m => !m.user.bot).length) return;
    log.info(user2name(data.member.user), 'delete', '#' + data.channel.name);
    before.channel.delete();
  },


  /**
   * Создание канала
   * Есть проверка на существование канала, в положительном случае - перекидывает в уже существующий канал.
   * Если есть сохранённая конфигурация - выставляет её.
   * Блокирует возможность присоединяться к #Создать канал
   *
   * @param  {VoiceState} data
   */
  create : async function(data){
    let user = DB.query('SELECT * FROM users WHERE id = ?', [data.member.user.id]);

    if(user.length){
      const channel = data.guild.channels.cache.get(user[0].voice_id);
      if(channel) return data.setChannel(channel);
    }

    let voice = user.length ? JSON.parse(user[0].voice_data) : this.new(data);
    let options = {
      reason : 'По требованию ' + user2name(data.member.user),
      parent : this.categoryChannel.id,
      type : 'voice'
    };

    if(voice.bitrate) options.bitrate = voice.bitrate;
    if(voice.permissionOverwrites) options.permissionOverwrites = voice.permissionOverwrites;
    if(voice.userLimit) options.userLimit = voice.userLimit;

    log.info(user2name(data.member.user), 'create', '#' + voice.name);
    const channel = await data.guild.channels.create(voice.name, options);

    data.setChannel(channel);

    this.channel.updateOverwrite(data.member, { CONNECT : false });
    channel.updateOverwrite(data.member, this.permission);

    DB.query('UPDATE users SET voice_id = ? WHERE id = ?', [
      channel.id, data.member.user.id,
    ]);
  },


  /**
   * Добавляет информацию о пользователе в базу и создаёт базовую конфигурацию канал
   *
   * @param  {VoiceState} data
   * @return {Object}          Конфигурация канала
   */
  new : function(data){
    const voice = { name : user2name(data.member.user) };

    DB.query('INSERT INTO users (id, voice_data) VALUES (?, ?)', [
      data.member.user.id, JSON.stringify(voice)
    ]);

    return voice;
  },


  /**
   * Сохраняет конфигурацию канала в базу.
   * Открывает доступ в #Создать канал
   *
   * @param  {VoiceChannel} channel Удалённый канал
   */
  save : function(channel){
    const user = DB.query('SELECT * FROM users WHERE voice_id = ?', [channel.id]);
    if(user.length){
      const permission = this.channel.permissionOverwrites.get(user[0].id);
      if(permission) permission.delete();
    }

    const voice = {
      name : channel.name,
      permissionOverwrites : channel.permissionOverwrites,
      userLimit : channel.userLimit,
      bitrate : channel.bitrate
    };

    DB.query('UPDATE users SET voice_id = ?, voice_data = ? WHERE voice_id = ?', [
      0, JSON.stringify(voice), channel.id
    ]);
  }

};
