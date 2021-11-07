module.exports = {

	active : true,
	name : 'activities',
	onlySlash : true,
	title : 'Доступ к Discord activities',
	text : 'Позволяет создавать в голосовых каналах Discord activities',
	example : ' [канал][activity]',
	category : 'Утилиты',


	init : function(){ return this; },

	/**
	 * @param {Object} int interaction
	 */
	slash : async function(int){
        console.log(int.data.options[0].value + ' ' + int.data.options[1].value)
		const invite = await client.api.channels(int.data.options[0].value).invites.post({
            data: {
                target_type: 2,
                target_application_id: `${int.data.options[1].value}`
            }});
        console.log(invite.code)
        interactionRespond.send(int, {content: `Приглашение сгенерированно, нажмите на кнопку ниже чтобы активировать ${int.data.options[1].name}.`, components:[{type : 1, components: [{type : 2, style: 5, url:'https://discord.gg/' + invite.code, label:'Присоединиться'}]}]})
	},  
};