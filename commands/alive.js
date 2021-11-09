module.exports = {

	active : true,
	name : 'alive',
	short : 'a',
	title : 'Доступ к сообществу',
	text : 'Переключает у указанных пользователей роль alive',
	example : ' [ID участника]+',
	category : 'Роли',


	int : {
		context : true,
		slash : true,
		options : [{
			name : 'user',
			description : 'Участник Сообщества',
			type : 6,
			required : true
		}]
	},


	init : function(){
		return this;
	},


	/**
	 * Роль "Alive"
	 *
	 * @type {Role}
	 */
	role : guild.roles.cache.get('648762974277992448'),


	/**
	 * @param {Message} msg
	 * @param {Array}   params Параметры команды
	 */
	call : async function(msg, params){
		// Возвращает help для alive
		if(!params.length && commands.list.help)
			return commands.list.help.call(msg, [this.name]);

		if(!this.permission(msg.member._roles))
			return send.error(msg, 'У вас недостаточно прав для изменения ролей других пользователей');

		let users = [];

		params.forEach(item => {
			const id = item.match(/^(<@!?)?([0-9]+)(>)?$/);
			if(id) return users.push(id[2]);
		});

		users.forEach(user => toggleRole(msg, this.role, user));
	},

	/**
	 * @param {Object} int interactions
	 */
	slash : async function(int){
		if(!this.permission(int.member.roles))
			return interactionRespond.send(int, {
				content : 'У вас недостаточно прав для изменения ролей других пользователей',
				flags : 64
			}, 'error');

		const text = toggleRole({ guild : guild, member : int.member }, this.role, int.data.options[0].value, true);
		return interactionRespond.send(int, { content : text }, 'success');
	},

	/**
	 * @param {Object} int interactions
	 */
	context : async function(int){
		if(!this.permission(int.member.roles))
			return interactionRespond.send(int, {
				content : 'У вас недостаточно прав для изменения ролей других пользователей',
				flags : 64
			}, 'error');

		const text = toggleRole({ guild : guild, member : int.member }, this.role, int.data.target_id, true);
		return interactionRespond.send(int, { content : text }, 'success');
	},

	/**
	 * Проверка наличия роли Сенат
	 *
	 * @param {Array} roles
	 */
	permission : roles => roles.includes('613412133715312641')

};
