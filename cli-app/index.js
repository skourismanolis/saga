#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();
const keytar = require('keytar');

const domain = 'http://127.0.0.1';
const port = 8080;
const SagaClient = require('@dira/api-client');
let client = new SagaClient({ url: domain+':'+port });

module.exports = {
	client,
};

const User = require('./src/User');

program.version('1.0.0');
const timeLabel = 'command duration';
program
	.option('-p, --profile', 'show how long command takes')
	.hook('preAction', async (thisCommand) => {
		if (thisCommand.opts().profile) {
			console.time(timeLabel);
		}
		await keytar.getPassword('Saga', 'Saga').then((result) => {
			if (result) client.setToken(result);
		});
	})
	.hook('postAction', async (thisCommand) => {
		if (thisCommand.opts().profile) {
			console.timeEnd(timeLabel);
		}
	});

//user
program.addCommand(User.login);
program.addCommand(User.logout);
program.addCommand(User.register);

program.parseAsync(process.argv);
