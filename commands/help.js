module.exports = {

	active : true,

	name : 'help',
	short : 'h',
	title : 'Помощь по командам',
	text : 'Возвращает список доступных команд или описание указанной команды',
	example : ' (command)',


	init : function(){ return this; },


	/**
	 * В зависимости от указанных параметров,
	 * отправляет либо описание указанной команды,
	 * либо список команд
	 *
	 * @param {Message} msg
	 * @param {Array}   params Параметры команды
	 */
	call : function(msg, params){
		const embed = params.length ? this.command(params[0]) : this.cache;
		send.call(msg, embed);
	},

	slash : function(response){
		interactionRespond.send(response, response.data.options.length ? this.command(response.data.options[0].value) : { embeds : [this.cache] });
	},

	/**
	 * Генерирование и кэширование списка команд
	 *
	 * @param  {Object} list Список команд
	 * @return {Embed}
	 */
	generate : function(list){
		let help = {};

		for(let c in list){
			if(typeof list[c] === 'string') continue;

			const category = list[c].category ? list[c].category : 'Остальные'

			if(!help.hasOwnProperty(category))
				help[category] = [];
			help[category].push(this.getExample(list[c]) + ' - ' + list[c].title);
		}

		this.cache = new Discord.MessageEmbed().setTitle('Список команд');

		for(let c in help){
			const command = help[c];
			this.cache.addField(c, help[c].sort().join('\n'));
		}

	},


	/**
	 * Возвращает описание указанной команды
	 *
	 * @param  {Array} name Название команды
	 * @return {Embed}
	 */
	command : function(name){
		const command = commands.get(name);

		if(!command)
		return new Discord.MessageEmbed()
			.setColor(0xf04747)
			.setDescription('Неизвестная команда. Воспользуйтесь `i!h`');

		return new Discord.MessageEmbed()
			.setTitle(command.title)
			.setDescription(this.getExample(command) + '\n' + command.text);
	},


	/**
	 * Возвращает пример использования команды
	 *
	 * @param  {Object} command Команда
	 * @return {String}
	 */
	getExample : command => '`' + config.prefix + command.name +
		'/' + command.short + command.example + '`'

};
