const list = {};
const commands = client.api.applications(client.user.id).guilds(guild.id).commands;

fs.readdirSync('./commands/').forEach(file => {

	const command = (require('./commands/' + file)).init();

	if(!command.active) return;

	list[command.name] = command;
	list[command.short] = command.name;

	if(!command.int) return;

	if(command.int.context)
		commands.post({data : { name : command.name, type : 2 }});

	if(command.int.slash)
		commands.post({data: {
			name : command.name,
			description : command.title,
			options : command.int.options,
			type : 1
		}});
});


// Генерирование и кэширование списка команд
if(list.help) list.help.generate(list);


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
