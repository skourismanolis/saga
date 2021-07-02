const { Command } = require('commander');
const program = new Command();

const login = program
	.command('login <email> <password>')
	.description('login to your account')
	.action(async (email, password) => {
		console.log(email);
		console.log(password);
	});

const register = program
	.command('register <name> <email> <password>')
	.description('register a new account')
	.action(async (email, password) => {
		console.log(email);
		console.log(password);
	});

module.exports = {
	login,
	register,
};
