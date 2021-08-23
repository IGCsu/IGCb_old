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
	call : function(msg, params){

		if(!params.length && commands.list.help)
			return commands.list.help.call(msg, [this.name]);

		const id = params[0].match(/^(<@!?)?([0-9]+)(>)?$/);
		if(!id) return commands.list.help.call(msg, [this.name]);

		this.fix(id[2], (text, status) => send.call(msg, text, status));
	},

	/**
	 * @param {Object} int interactions
	 */
	context : function(int){
		this.fix(int.data.target_id, (text, status, flags) => {
			interactionRespond.send(int, { content : text, flags : flags }, status);
		});
	},

	/**
	 * @param {Number}   id           ID участника
	 * @param {Function} callbackSend Функция отправки сообщения
	 */
	fix : async (id, callbackSend) => {
		let member;

		try{
			member = await guild.members.fetch(id);
		}catch(e){
			return callbackSend('Участник не найден', 'error', 64);
		}

		if(!commands.list.name) return callbackSend('Модуль "name" не активен', 'error', 64);

		const result = commands.list.name.silent(member);
		const name = member2name(member, 1);

		if(result.status) return callbackSend('Никнейм исправлен `' + result.name + '` => `' + result.fixed + '`', 'success');
		return callbackSend('Никнейм пользователя ' + name + ' корректен', 'error', 64);
	}


};
