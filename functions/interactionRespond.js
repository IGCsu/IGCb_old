module.exports = {

	send :      function(int, text, embed, status, flags){ this.call(int, text, embed, 4, status, flags); },
	defSend :   function(int, text, embed, status, flags){ this.call(int, text, embed, 5, status, flags); },
	update :    function(int, text, embed, status, flags){ this.call(int, text, embed, 7, status, flags); },
	defUpdate : function(int, text, embed, status, flags){ this.call(int, text, embed, 6, status, flags); },

	/**
	 * @param {Object} int    interactions
	 * @param {String} text
	 * @param {Number} type
	 * @param {String} status Статус ответа, для прикрепления эмодзи
	 * @param {Number} flags  Флаги сообщения
	 */
	call : (int, text, embed, type, status, flags) => client.api.interactions(int.id, int.token).callback.post({
		data : {
			type : type,
			data : {
				flags : flags,
				content : (reaction.emoji[status] || '') + ' ' + text,
				embeds : [
					embed
				]
			}
		}
	})

};
