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
<<<<<<< HEAD
      text += this.getExample(command) + ' - ' + command.title + '\n';
=======
      text += this.example(command) + ' - ' + command.title + '\n';
>>>>>>> d31726777f03bdd74777652d85f6fe28e744868b
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
<<<<<<< HEAD
      .setDescription(this.getExample(command) + '\n' + command.text);
=======
      .setDescription(this.example(command) + '\n' + command.text);
>>>>>>> d31726777f03bdd74777652d85f6fe28e744868b
  },


  /**
   * Возвращает пример использования команды
   *
   * @param  {Object} command Команда
   * @return {String}
   */
<<<<<<< HEAD
  getExample : command => '`' + config.prefix + command.name +
=======
  example : command => '`' + config.prefix + command.name +
>>>>>>> d31726777f03bdd74777652d85f6fe28e744868b
    '/' + command.short + ' ' + command.example + '`'

};
