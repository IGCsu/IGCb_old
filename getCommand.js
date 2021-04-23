/**
 * Возвращает команду. При неудаче - false
 *
 * @param  {String} name Название команды
 * @return {Object}      Команда
 */
module.exports = name => {
  let command = commands[name];

  if(!command) return false;
  if(typeof command === 'string') command = commands[command];

  return command;
};
