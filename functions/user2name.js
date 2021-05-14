/**
 * Формирует имя пользователя
 *
 * @param  {User}   n Объект пользователя
 * @return {String}
 */
module.exports = (u, id) => {
  let text = u.username + '#' + u.discriminator;

  if(id) text = u.id + ':' + text;

  return text;
};
