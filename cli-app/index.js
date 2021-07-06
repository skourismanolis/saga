#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();
const keytar = require('keytar');

const domain = 'http://127.0.0.1';
const port = 3000;
const SagaClient = require('@dira/api-client');
let client = new SagaClient({ url: domain + ':' + port });

module.exports = {
	client,
};

const User = require('./src/User');
const Issue = require('./src/Issue');
const Project = require('./src/Project');

program.version('1.0.0');

program
	.option(
		'-a, --account <name>',
		'account name to store login details to',
		'Saga'
	)
	.hook('preAction', async () => {
		client.accountName = program.opts().account;
		await keytar.getPassword('Saga', client.accountName).then((result) => {
			if (result) client.setToken(result);
		});
	});

//user
program.addCommand(User.login);
program.addCommand(User.logout);
program.addCommand(User.register);
program.addCommand(User.user);

//issues
program.addCommand(Issue.issue);

//projects
program.addCommand(Project.project);

program.parseAsync(process.argv);
