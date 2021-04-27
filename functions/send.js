module.exports = {

  success : function(msg, text){ this.call(msg, reaction.success + ' ' + text) },
  error : function(msg, text){ this.call(msg, reaction.error + ' ' + text) },

  call : (msg, text) => msg.channel.send(text)

};
