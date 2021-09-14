const translit = require('transliteration');

module.exports = {

	active : true,
	name : 'name',
	short : 'n',
	title : 'Обновление никнеймов',
	text : 'Используется для обновления никнейма',
	example : ' [никнейм]',
	category : 'Никнейм',


	init : function(){
		client.on('guildMemberAdd', member => this.silent(member));
		client.on('userUpdate', async (oldUser, newUser) => {
			if(oldUser.username == newUser.username) return;
			const member = await guild.members.fetch({ user : newUser });
			if(member) this.silent(member);
		});
		client.on('guildMemberUpdate', (oldMember, newMember) => {
			if(member2name(oldMember) == member2name(newMember)) return;
			this.silent(newMember);
		});

		return this;
	},


	options : {
		ignore : ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л',
			'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ь',
			'ы', 'ъ', 'э', 'ю', 'я', 'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И',
			'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч',
			'Ш', 'Щ', 'Ь', 'Ы', 'Ъ', 'Э', 'Ю', 'Я', '-', '_', '\'', '`', '.', '[', ']',
			'(', ')']
	},


	/**
	 *
	 *
	 * @param {Message} msg
	 * @param {Array}   params Параметры команды
	 */
	call : async function(msg, params){

		// Возвращает help для nick
		if(!params.length && commands.list.help)
			return commands.list.help.call(msg, [this.name]);

		const name = params.join(' ');
		const fixed = this.fix(name);



		if(fixed.length > 30)
			return send.error(msg, 'Никнейм недопустимой длины. Максимальная длина - 30 символов. Длина никнейма `' + fixed + '` - ' + fixed.length);

		if(fixed.length < 3)
			return send.error(msg, 'Никнейм недопустимой длины. Минимальная длина - 3 символа. Длина никнейма `' + (fixed == 'Rename me please' ? name : fixed) + '` - ' + (fixed == 'Rename me please' ? name.length : fixed.length));

		if(name == fixed){
			if(fixed.length > 20)
				await send.warning(msg, 'Никнейм превышает рекомендуемую длину. Рекомендуемая длинна - до 20 символов. Длина никнейма `' + fixed + '` - ' + fixed.length);
			try{
				const old = member2name(msg.member);
				await msg.member.setNickname(name, 'По требованию ' + member2name(msg.member, 1));
				return send.success(msg, 'Никнейм изменён `' + old + '` => `' + name + '`');
			}catch(e){
				return send.error(msg, 'Упс... Ошибка');
			}
		}

		const button = new disbut.MessageButton()
			.setStyle('blurple')
			.setLabel('Установить исправленный никнейм')
			.setID('name|' + msg.author.id + '|' + fixed);

		const embed = new Discord.MessageEmbed()
			.setColor(reaction.color.error)
			.setFooter(member2name(msg.member, 1), msg.author.avatarURL({ dynamic : true }))
			.setTitle('Введённый ник содержит некорректные символы!')
			.setDescription('Введите другой ник, или примите исправленный вариант.\n`' + name + '` - введённый вариант\n`' + fixed + '` - исправленный вариант');

		msg.channel.send(embed, button);
	},


	/**
	 *
	 *
	 * @param {MessageComponent} button
	 * @param {Array}            params Параметры команды
	 */
	button : async (button, param) => {

		if(button.clicker.id == param[1]){
			await button.message.delete();
			try{
				const old = member2name(button.clicker.member);
				await button.clicker.member.setNickname(param[2], 'По требованию ' + member2name(button.clicker.member, 1));
				if(param[2].length > 20)
					send.warning(button.message, 'Никнейм превышает рекомендуемую длину. Рекомендуемая длинна - до 20 символов. Длина никнейма `' + param[2] + '` - ' + param[2].length);
				return send.success(button.message, 'Никнейм изменён `' + old + '` => `' + param[2] + '`');
			}catch(e){
				return send.error(button.message, 'Упс... Ошибка');
			}
		}

		button.reply.send(reaction.emoji['error'] + ' Выбор предложен другому участника', true);

	},


	/**
	 * Тихое обновление
	 * Обновление никнейма пользователя без его участия
	 *
	 * @param  {GuildMember} member
	 * @return {String}
	 */
	silent : function(member){
		const name = member2name(member);

		let fixed = this.fix(name);
		if(fixed.length > 30) fixed = fixed.substring(0, 30);

		if(fixed == name) return { status : false };

		member.setNickname(fixed, 'По требованию Устава Сообщества').then(() => {}, () => {});
		member.send("Ваш никнейм в сообществе IGC был изменён т.к. в нём присутствовали запрещённые символы")

		return { status : true, fixed : fixed, name : name };
	},


	/**
	 * Исправление строки
	 *
	 * @param  {String} name
	 * @return {String}
	 */
	fix : function(name){
		name = translit.transliterate(name, this.options);
		name = name.replace(/[^а-яёa-z0-9`'\[\]\(\)_\-\.\s]/gi, '');
		name = name.replace(/\s+/gi, ' ');
		name = name.replace(/^[^а-яёa-z0-9\[\(]+/gi, '');
		name = name.trim();
		if(!name.length) name = 'Rename me please';

		return name;
	}

};
