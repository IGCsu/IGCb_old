const fs = require('fs');
const list = {};

fs.readdir('./commands/', (err, files) => {
  files.forEach(file => {

    const command = require('./commands/' + file);

    if(!command.active) return;

    list[command.name] = command;
    list[command.short] = command.name;

  });
});

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
