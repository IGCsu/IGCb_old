module.exports = {

	active : true,
	name : 'alive',
	short : 'a',
	title : 'Доступ к сообществу',
	text : 'Переключает у указанных пользователей роль alive',
	example : ' [ID участника]+',
	category : 'Роли',


	init : function(){ return this; },


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
	call : function(msg, params){

		// Возвращает help для alive
		if(!params.length && commands.list.help)
		return commands.list.help.call(msg, [this.name]);

		if(!this.permission(msg.member))
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
	context : function(int){
		const member = guild.member(int.member.user.id);
		if(!this.permission(member))
			return interactionRespond.send(int, {
				content : 'У вас недостаточно прав для изменения ролей других пользователей',
				flags : 64
			}, 'error');

		const text = toggleRole({ guild : guild, member : member }, this.role, int.data.target_id, true);
		return interactionRespond.send(int, { content : text }, 'success');
	},

	/**
	 * Проверка наличия роли Сенат
	 *
	 * @param {Member} member
	 */
	permission : member => member._roles.includes('613412133715312641')

};
