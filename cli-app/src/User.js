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
			if (error.response)
				console.error(error.response.data);
			else
				console.error(error);
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
			if (error.response)
				console.error(error.response.data);
			else
				console.error(error);
		}
	});

const user = program.command('user');
user
	.command('delete <password>')
	.description('delete this user profile')
	.action(async (password) => {
		try {
			await client.deleteUser({password});
			console.log(
				'User deleted successfully!'
			);
			await keytar.deletePassword('Saga', 'Saga');
		} catch (error) {
			if (error.response)
				console.error(error.response.data);
			else
				console.error(error);
		}
	});

user
	.command('update <username> <email> <password> <name> <surname> <plan>')
	.description('update this user profile')
	.action(async (username, email, password, name, surname, plan) => {
		try {
			await client.userEdit({username, email, password, name, surname, plan});
			console.log(
				'User updated successfully!'
			);
		} catch (error) {
			if (error.response)
				console.error(error.response.data);
			else
				console.error(error);
		}
	});

user
	.command('get')
	.description('update this user profile')
	.action(async () => {
		try {
			let data = await client.getProfile();
			console.log(
				data
			);
		} catch (error) {
			if (error.response)
				console.error(error.response.data);
			else
				console.error(error);
		}
	});

module.exports = {
	login,
	logout,
	register,
	user,
};
