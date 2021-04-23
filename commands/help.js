module.exports = {

  active : true,

  name : 'help',
  short : 'h',
  title : 'Вывод списка команд',
  text : 'Возвращает список доступных команд или описание указанной команды',
  example : '(command)',


  /**
   * В зависимости от указанных параметров,
   * отправляет либо описание указанной команды,
   * либо список команд
   *
   * @param {Message} msg
   * @param {Array}   params Параметры команды
   */
  call : function(msg, params){
    const embed = params.length ? this.command(params[0]) : this.list();
    msg.channel.send(embed);
  },


  /**
   * Возвращает список команд
   *
   * @return {Embed}
   */
  list : function(){
    let text = '';

    for(let c in commands){
      const command = commands[c];
      if(typeof command === 'string') continue;
      text += this.getExample(command) + ' - ' + command.title + '\n';
    }

    return new Discord.MessageEmbed()
      .setTitle('Список команд')
      .setDescription(text);
  },


  /**
   * Возвращает описание указанной команды
   *
   * @param  {Array} name Название команды
   * @return {Embed}
   */
  command : function(name){
    const command = getCommand(name);

    if(!command)
      return new Discord.MessageEmbed()
        .setColor(0xf04747)
        .setDescription('Неизвестная команда. Воспользуйтесь `i!h`');

    return new Discord.MessageEmbed()
      .setTitle(command.title)
      .setDescription(this.getExample(command) + '\n' + command.text);
  },


  /**
   * Возвращает пример использования команды
   *
   * @param  {Object} command Команда
   * @return {String}
   */
  getExample : command => '`' + config.prefix + command.name +
    '/' + command.short + ' ' + command.example + '`'

};
