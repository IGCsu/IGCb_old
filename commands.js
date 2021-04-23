const fs = require('fs');
const commands = {};

fs.readdir('./commands/', (err, files) => {
  files.forEach(file => {

    const command = require('./commands/' + file);

    if(!command.active) return;

    commands[command.name] = command;
    commands[command.short] = command.name;

  });
});

module.exports = commands;
