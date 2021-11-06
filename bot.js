global.Discord = require('discord.js');
global.client = new Discord.Client({intents : Discord.Intents.ALL}); //.remove(['DIRECT_MESSAGE_TYPING', 'GUILD_MESSAGE_TYPING'])
global.config = require('./config.json');
global.DB = new (require('sync-mysql'))(config.mysql);
global.fs = require('fs');
global.disbut = require('discord-buttons');
global.retardMode = true
global.predict_name = ''
disbut(client);

client.on('ready', msg => {
	global.guild = client.guilds.cache.get(config.home);
	global.everyone = guild.roles.cache.get('433242520034738186');

	fs.readdirSync('./functions/').forEach(file => {
		global[file.split('.')[0]] = require('./functions/' + file);
	});

	global.commands = require('./commands');
	client.user.setActivity('i!help', { type: 'LISTENING' });
	log.start('== Bot ready ==');
});

client.on('message', msg => {

	// Проверка на канал и наличие префикса
	if(msg.author.id == client.user.id) return;
	if(msg.channel.type == 'dm') return send.error(msg, 'Лс для пидоров');
	if(msg.channel.guild.id != config.home) return;

	if(msg.content.substr(0, config.prefix.length) != config.prefix){
		reaction.rule(msg)
		if(retardMode){
			reaction.suggestion2(msg)
		} else {
			reaction.suggestion1(msg)
		}
		//reaction.suggestion3(msg)
		if(msg.channel.id == 681790010550255617) reaction.nsfw(msg) 		// Анализатор ссылок в nsfw
		if(msg.channel.id == 500300930466709515) reaction.opinion(msg); 	// Реакции в #предложения
		if(msg.channel.id == 572472723624951839) reaction.event(msg);   	// Реакции в #ивенты
		if(msg.channel.id == 612280548777525249) reaction.elections(msg);	// Реакции в #выборы
		if(commands.list.phishing) return commands.list.phishing.message(msg);
	}

	if(msg.author.bot) return;

	const content = msg.content.substr(config.prefix.length).split(/\s+/);
	const command = commands.get(content.shift().toLowerCase());

	if(!command) return;
	msg.channel.send('Все модули бота поддерживают слеш команды.\nПопробуйте пользоваться слэш командами в течении какого нибудь времени чтобы привыкнуть к ним.\nВ апреле 2022 большинство ботов перейдёт на такой тип взаимодействия, вы к этому уже будете готовы')
	log.info(member2name(msg.member, 1, 1), 'used', msg.content);
	command.call(msg, content);
});

client.on('clickButton', button => {
	const param = button.id.split('|');
	if(!param.length) return;

	if(param[0] == 'dismiss'){
		reaction.button1(button, param)
	}
	if(param[0] == 'deleteOriginal'){
		reaction.button2(button, param)
	}
	if(param[0] == 'correct'){
		reaction.button3(button, param)
	}
	const command = commands.get(param[0]);
	if(!command) return;

	command.button(button, param);
});

//Обработка команд контексного меню
client.on('raw', response => {
	if(response.t != "INTERACTION_CREATE") return;
	if(response.d.type == 2) {

		const command = commands.get(response.d.data.name.toLowerCase());
		if(!command)
			return interactionRespond.send(response.d, {
				content : 'Команда не найдена',
				flags : 64
			}, 'error');

		log.info(member2name(response.d.member, 1, 1), 'used', '/' + response.d.data.name);
		if(response.d.data.type == 2 || response.d.data.type == 3)
			command.context(response.d);
		else if(response.d.data.type == 1)
			command.slash(response.d);
		
	} else if(response.d.type == 4){
		const command = commands.get(response.d.data.name.toLowerCase());
		if(!command) return;
		command.predict(response.d)
	};
});

client.login(config.token);
