#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();

const User = require('./src/User');

program.version('1.0.0');

const timeLabel = 'command duration';
program
	.option('-p, --profile', 'show how long command takes')
	.hook('preAction', (thisCommand) => {
		if (thisCommand.opts().profile) {
			console.time(timeLabel);
		}
	})
	.hook('postAction', (thisCommand) => {
		if (thisCommand.opts().profile) {
			console.timeEnd(timeLabel);
		}
	});

//user
program.addCommand(User.login);
program.addCommand(User.register);

program.parse(process.argv);
