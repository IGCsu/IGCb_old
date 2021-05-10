const fs = require('fs');
const list = {};

fs.readdirSync('./commands/').forEach(file => {

  const command = (require('./commands/' + file)).init();

  if(!command.active) return;

  list[command.name] = command;
  list[command.short] = command.name;

});


// Генерирование и кэширование списка команд
if(list.help) list.help.generate(list);


module.exports = {

  list : list,

  /**
   * Возвращает команду. При неудаче - false
   *
   * @param  {String} name Название команды
   * @return {Object}      Команда
   */
  get : function(name){
    let command = this.list[name];

    if(!command) return false;
    if(typeof command === 'string') command = this.list[command];

    return command;
  }

};
