module.exports = {

	send :      function(int, text, status){ this.call(int, text, 4, status); },
	defSend :   function(int, text, status){ this.call(int, text, 5, status); },
	update :    function(int, text, status){ this.call(int, text, 7, status); },
	defUpdate : function(int, text, status){ this.call(int, text, 6, status); },

	/**
	 * @param {Object} int    interactions
	 * @param {String} text
	 * @param {Number} type
	 * @param {String} status Статус ответа, для прикрепления эмодзи
	 */
	call : (int, text, type, status) => client.api.interactions(int.id, int.token).callback.post({
		data : {
			type : type,
			data : { flags : 64, content : (reaction.emoji[status] || '') + ' ' + text }
		}
	})

};
