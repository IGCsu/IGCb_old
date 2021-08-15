module.exports = {

	send :      function(int, text, status, flags){ this.call(int, text, 4, status, flags); },
	defSend :   function(int, text, status, flags){ this.call(int, text, 5, status, flags); },
	update :    function(int, text, status, flags){ this.call(int, text, 7, status, flags); },
	defUpdate : function(int, text, status, flags){ this.call(int, text, 6, status, flags); },

	/**
	 * @param {Object} int    interactions
	 * @param {String} text
	 * @param {Number} type
	 * @param {String} status Статус ответа, для прикрепления эмодзи
	 * @param {Number} flags  Флаги сообщения
	 */
	call : (int, text, type, status, flags) => client.api.interactions(int.id, int.token).callback.post({
		data : {
			type : type,
			data : {
				flags : flags,
				content : (reaction.emoji[status] || '') + ' ' + text
			}
		}
	})

};
