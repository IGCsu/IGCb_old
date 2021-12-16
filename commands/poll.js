module.exports = {

	active : true,
	name : 'poll',
	onlySlash : true,
	title : 'Опросы',
	text : 'Позволяет создавать общие и модераторские опросы',
	example : ' [канал][activity]',
	category : 'Утилиты',


	init : function(){ return this; },

	/**
	 * @param {Object} int interaction
	 */
	slash : async function(int){
        const msg = getMsg(int);
        console.log(int.data);
        const type = int.data.options[0].name;
        if(type == 'common' || type == 'senate'){
            const question = int.data.options[0].options[0].value;
            const txt = (type == 'common' ? 'Общий' : 'Закрытый' )
            interactionRespond.send(int, {content: `${txt} опрос: ${question}`, components:[{type : 1, components: [{type : 2, style: 3, custom_id:'poll|yes', label:'За'}, {type : 2, style: 4, custom_id:'poll|no', label:'Против'}]}], allowed_mentions:{parse:[]}})
        };
    },
    button : async function(int, param){
        interactionRespond.send(int, {content: 'В разработке', flags: 64});
    },
};