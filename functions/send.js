module.exports = {

  success : function(msg, text){ this.call(msg, text, 'success') },
  error : function(msg, text){ this.call(msg, text, 'error') },

  call : (msg, text, type) => {

    if(type){
      if(typeof text == 'string')
        text = reaction.emoji[type] + ' ' + text;
      else
        text = text.setColor(reaction.color[type]);
    }

    msg.channel.send(text)
  }

};
