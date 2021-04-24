module.exports = {

  // admin : ctx => ctx.,

  get : function(name){
    let command = this.list[name];

    if(!command) return false;
    if(typeof command === 'string') command = this.list[command];

    return command;
  }

};
