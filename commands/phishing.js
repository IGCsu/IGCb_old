module.exports = {

	active : true,
	name : 'phishing',
	short : 'ph',
	title : 'Защита от различного рода фишинга',
	text : 'Модуль проверяет сообщения пользователя на наличие ссылок, и если таковые обнаруживает - ищет вхождения в списке опасных, и в случае совпадения - удаляет сообщение, а автора отправляет в буфер.\nКоманда используется членами Сената для добавления новых ссылок в базу. Принимает регулярное выражение без `//`.\nПроверить работу регулярки можно на https://regex101.com.',
	example : ' [regex]',
	category : 'Модерация',


	last : {},

	channel : guild.channels.cache.get('500010381490782238'),
	roleMute : guild.roles.cache.get('474609269300396036'),


	init : function(){ return this.cacheUpdate(); },


	/**
	 * Обновляет кэш
	 *
	 * @return {Object}  this
	 */
	cacheUpdate : function(){
		this.links = {};

		DB.query('SELECT * FROM phishing').forEach(link => {
			this.links[link.value] = link;
		});

		this.regex = new RegExp('(' + Object.keys(this.links).join('|') + ')', 'i');

		return this;
	},


	/**
	 *
	 *
	 * @param {Message} msg
	 * @param {Array}   params Параметры команды
	 */
	call : async function(msg, params){
		if(!params.length) return this.help(msg);

		if(!this.permission(msg))
			return send.error(msg, 'У вас недостаточно прав');

		const value = params.join(' ').replace(/`/g, '').trim();

		if(this.links[value]){
			DB.query('DELETE FROM phishing WHERE id = ?', [this.links[value].id]);
			send.success(msg, '`' + value + '` - больше не содержится в базе');
			return this.cacheUpdate();
		}

		if(value.length < 5)
			return send.error(msg, '`' + value + '` - меньше 5 символов. Слишком короткая строка может создать проблемы');

		try{
			new RegExp(value, 'i');
		}catch(e){
			return send.error(msg, '`' + value + '` - некорректно. ' + e.message);
		}

		DB.query('INSERT INTO phishing (value, author) VALUES (?, ?)', [
			value, msg.author.id
		]);
		this.cacheUpdate();
		return send.success(msg, '`' + value + '` - добавлен в базу');
	},


	/**
	 * Отправляет help и список регулярок
	 *
	 * @param {Message} msg
	 */
	help : function(msg){
		let list = '';

		for(const i in this.links)
			list += '`' + this.links[i].value + '` - <@' + this.links[i].author + '>\n';

		const example = !commands.list.help ? ''
			: commands.list.help.getExample(this);

		const embed = new Discord.MessageEmbed()
			.setTitle(this.title)
			.setDescription(example + '\n' + this.text)
			.addField('Текущая база', list);
		send.call(msg, embed);
	},


	message : async function(msg){
		const last = this.last[msg.author.id] ? this.last[msg.author.id]
			: this.last[msg.author.id] = false;
		// this.last[msg.author.id] = msg; Если раскомментировать, будет сохраняться каждое сообщение, что не имеет смысла, если не делать защиту от флуда
		const links = msg.content.match(/(\b(https?|ftp|file):\/\/[-A-ZА-ЯЁ0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9А-ЯЁ+&@#\/%=~_|])/gmiu);
		const double = last && last.content == msg.content && msg.createdTimestamp - last.createdTimestamp < 7000;
		const doubleChannel = last && last.channel.id == msg.channel.id;

		// if(double) last.delete(); Если раскомментировать, код будет удалять любое повторяющееся сообщение. Будет защищать от флуда, однако подобное решение может негативно сказаться на впечатлении. Лучше избежать его использования

		if(!double && !links) return;

		this.last[msg.author.id] = msg;

		let found = [];

		if(!double){
			for(const link of links)
				if(this.regex.test(link)) found.push(link);
			if(!found.length) return;
		}

		if(doubleChannel && !found.length) return;
		if(!found.length) found = links;

		// msg.member.roles.remove(commands.list.alive.role, 'Фишинг');
		msg.member.roles.add(this.roleMute, 'Фишинг');

		const embed = new Discord.MessageEmbed()
			.setColor(reaction.color.error)
			.setTitle('Буфер | ' + member2name(msg.member, 1))
			.addField('User', '<@' + msg.author.id + '>', true)
			.addField('Reason', 'Фишинг', true)
			.addField('Found', found);

		this.channel.send(embed);
		msg.delete();
		if(double) last.delete();

		let update = false;
		for(const link of links)
		if(!this.regex.test(link)){
			DB.query('INSERT INTO phishing (value, author) VALUES (?, ?)', [
				link.replace(/(\+|\/|\*|\||\?|\.|\,|\-)/g, '\\$1'), client.user.id
			]);
			update = true;
		}
		if(update) this.cacheUpdate();
	},


	/**
	 * Проверка наличия роли сенат
	 *
	 * @param {Message} msg
	 */
	permission : msg => msg.member._roles.includes('613412133715312641')


};
