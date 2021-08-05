const translit = require('transliteration');

module.exports = {

	active : true,
	name : 'nameFix',
	short : 'nf',
	title : 'Исправление никнейма',
	text : 'Используется для исправления никнейма пользователей. Команда доступна всем.',
	example : ' [ID пользователя]',
  category : 'Никнейм',


	init : function(){ return this; },


	/**
	 *
	 *
	 * @param {Message} msg
	 * @param {Array}   params Параметры команды
	 */
	call : async function(msg, params){

		if(!params.length && commands.list.help)
			return commands.list.help.call(msg, [this.name]);

		const id = params[0].match(/^(<@!?)?([0-9]+)(>)?$/);
		if(!id) return commands.list.help.call(msg, [this.name]);

		const member = await guild.members.fetch(id[2]);

		if(!member) return send.error(msg, 'Участник не найден');
		if(!commands.list.name) return send.error(msg, 'Модуль "name" не активен');

		const result = commands.list.name.silent(member);
		const name = member2name(member, 1);

		if(result) return send.success(msg, 'Никнейм пользователя ' + name + ' исправлен');
		return send.error(msg, 'Никнейм пользователя ' + name + ' корректен');
	},


};
