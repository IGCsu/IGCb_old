global.Discord = require('discord.js');
myIntents = new Discord.Intents(32767)
flg = Discord.Intents.FLAGS
myIntents.remove(flg.GUILD_MESSAGE_TYPING, flg.DIRECT_MESSAGE_TYPING, flg.DIRECT_MESSAGE_REACTIONS)
global.client = new Discord.Client({intents : myIntents}); //.remove(['DIRECT_MESSAGE_TYPING', 'GUILD_MESSAGE_TYPING'])
// global.DB = new (require('sync-mysql'))(config.mysql);
global.fs = require('fs');
global.retardMode = true
global.predict_name = ''

client.on('ready', msg => {
	global.guild = client.guilds.cache.get('433242520034738186');
	global.everyone = guild.roles.cache.get('433242520034738186');

	fs.readdirSync('./functions/').forEach(file => {
		global[file.split('.')[0]] = require('./functions/' + file);
	});

	global.commands = require('./commands');
	client.user.setActivity('i!help', { type: 'LISTENING' });
	log.start('== Bot ready ==');
});

client.on('messageCreate', async msg => {

	// Проверка на канал и наличие префикса
	if(msg.author.id == client.user.id) return;
	if(msg.channel.type == 'dm') return send.error(msg, 'Лс для пидоров');
	if(msg.channel.guild.id != '433242520034738186') return;

	if(msg.content.substr(0, process.env.PREFIX.length) != process.env.PREFIX){
		await reaction.rule(msg)
		if(retardMode){
			await reaction.suggestion2(msg)
		} else {
			await reaction.suggestion1(msg)
		}
		//reaction.suggestion3(msg)
		if(msg.channel.id == 681790010550255617) await reaction.nsfw(msg) 		// Анализатор ссылок в nsfw
		if(msg.channel.id == 500300930466709515) await reaction.opinion(msg); 	// Реакции в #предложения
		if(msg.channel.id == 572472723624951839) await reaction.event(msg);   	// Реакции в #ивенты
		if(msg.channel.id == 612280548777525249) await reaction.elections(msg);	// Реакции в #выборы
		if(commands.list.phishing) return commands.list.phishing.message(msg);
	}

	if(msg.author.bot) return;

	const content = msg.content.substr(process.env.PREFIX.length).split(/\s+/);
	const command = commands.get(content.shift().toLowerCase());

	if(!command || command.onlySlash) return;
	await msg.channel.send({ content : 'Все модули бота поддерживают слеш команды.\nПопробуйте пользоваться слэш командами в течении какого нибудь времени чтобы привыкнуть к ним.\nВ апреле 2022 большинство ботов перейдёт на такой тип взаимодействия, вы к этому уже будете готовы' })
	log.info(member2name(msg.member, 1, 1), 'used', msg.content);
	await command.call(msg, content);
});

//Обработка INTERACTION_CREATE
client.on('raw', async response => {
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
			await command.context(response.d);
		else if(response.d.data.type == 1)
		await command.slash(response.d);

	} else if(response.d.type == 4){
		const command = commands.get(response.d.data.name.toLowerCase());
		if(!command) return;
		await command.predict(response.d)
	} else if(response.d.type == 3){
		if(response.d.data.component_type != 2) return;

		const param = response.d.data.custom_id.split('|');
		if(!param.length) return;

		if(param[0] == 'dismiss'){
			await reaction.button1(response.d, param)
		}
		if(param[0] == 'deleteOriginal'){
			await reaction.button2(response.d, param)
		}
		if(param[0] == 'correct'){
			await reaction.button3(response.d, param)
		}
		const command = commands.get(param[0]);
		if(!command) return;

		command.button(button, param);
	}
});

client.login(process.env.TOKEN);
