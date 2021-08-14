module.exports = {

	send :      function(int, text){ this.call(int, text, 4); },
	defSend :   function(int, text){ this.call(int, text, 5); },
	update :    function(int, text){ this.call(int, text, 7); },
	defUpdate : function(int, text){ this.call(int, text, 6); },

	/**
	 * @param {Object} int  interactions
	 * @param {String} text
	 * @param {Number} type
	 */
	call : (int, text, type) => client.api.interactions(int.id, int.token).callback.post({
		data : {
			type : type,
			data : { flags : 64, content : text }
		}
	})

};
