/**
 * Переключение роли участнику.
 *
 * @param {Message} msg
 * @param {Role}    role
 * @param {Number}  user ID пользователя
 */
module.exports = (msg, role, user) => {
  const member = msg.guild.member(user);

  if(!member)
    return send.error(msg, 'Пользователь с ID:' + user + ' не найден');

  let action = { val : 'add', text : 'выдана' };
  if(member._roles.includes(role.id))
    action = { val : 'remove', text : 'убрана у' }

  member.roles[action.val](role, 'По требованию ' + member2name(msg.member));
  send.success(msg, 'Роль ' + role.name + ' ' + action.text + ' ' + member2name(member));
};
