/**
 * Формирует имя пользователя
 *
 * @param  {User}   n Объект пользователя
 * @return {String}
 */
module.exports = (u) => u.username + '#' + u.discriminator;
