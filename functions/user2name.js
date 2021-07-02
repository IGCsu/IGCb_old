/**
 * Формирует имя пользователя
 *
 * @param  {User}   n Объект пользователя
 * @return {String}
 */
module.exports = (u, id) => {
  let text = u.displayName + '#' + u.discriminator;

  if(id){
    if(u.bot) text = 'bot:' + text;
    text = u.id + ':' + text;
  }

  return text;
};
