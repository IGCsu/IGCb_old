module.exports = {

  success : function(msg, text){ return this.call(msg, text, 'success') },
  warning : function(msg, text){ return this.call(msg, text, 'warning') },
  error : function(msg, text){ return this.call(msg, text, 'error') },

  call : (msg, text, type) => {

    if(type){
      if(typeof text == 'string')
        text = reaction.emoji[type] + ' ' + text;
      else
        text = text.setColor(reaction.color[type]);
    }

    return msg.channel.send(text);
  }

};
