const { Command } = require('commander');
const program = new Command();
const keytar = require('keytar');

const { client } = require('../index');

const login = program
	.command('login <email> <password>')
	.description('login to your account')
	.action(async (email, password) => {
		try {
			await client.login({ email, password });
			await keytar.setPassword('Saga', 'Saga', client._token);
		} catch (error) {
			console.error(error.response.data);
		}
	});

const logout = program
	.command('logout')
	.description('logout of your account')
	.action(async () => {
		try {
			await keytar.deletePassword('Saga', 'Saga');
		} catch (error) {
			console.error(error.response.data);
		}
	});

const register = program
	.command('register <email> <password> <name> <surname> <plan> [username]')
	.description('register a new account')
	.action(async (email, password, name, surname, plan, username) => {
		username = username || null;
		try {
			await client.register({
				email,
				password,
				name,
				surname,
				plan,
				username,
			});
			console.log(
				'Registration Complete! We have sent you a verification email'
			);
		} catch (error) {
			console.error(error.response.data);
		}
	});

module.exports = {
	login,
	logout,
	register,
};
