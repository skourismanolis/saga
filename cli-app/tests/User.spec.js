const { cli } = require('./testIndex');
const SagaClient = require('@dira/api-client');
const keytar = require('keytar');

let client = new SagaClient({ url: __APIURL__ }); //TODO only keep decleration

beforeAll(async () => {
	client = new SagaClient({ url: __APIURL__ });
});

describe('basic user interactions', () => {
	const users = [
		{
			email: 'user_1@testing.com',
			password: 'password',
			accountName: 'user_test_1',
			name: 'Giorgos',
			surname: 'Georgiou',
			plan: 'Free',
			username: 'georgios99',
		},
		{
			email: 'user_2@testing.com',
			password: 'password',
			accountName: 'user_test_2',
			name: 'Katerina',
			surname: 'Allexiou',
			plan: 'Premium',
			username: null,
		},
		{
			email: 'user_3@testing.com',
			password: 'password',
			accountName: 'user_test_3',
			name: 'Maria',
			surname: 'Pappa',
			plan: 'Host',
			username: 'null',
		},
	];

	it('creates a user', async () => {
		let result = await cli(
			[
				'-a',
				users[0].accountName,
				'register',
				users[0].email,
				users[0].password,
				users[0].name,
				users[0].surname,
				users[0].plan,
				users[0].username,
			],
			'.'
		);
		expect(result.code).toBe(0);
		await expect(
			client.login({ email: users[0].email, password: users[0].password })
		).resolves.not.toThrow();
	});

	it('creates two more users', async () => {
		let result1 = await cli(
			[
				'-a',
				users[1].accountName,
				'register',
				users[1].email,
				users[1].password,
				users[1].name,
				users[1].surname,
				users[1].plan,
				users[1].username,
			],
			'.'
		);
		let result2 = await cli(
			[
				'-a',
				users[2].accountName,
				'register',
				users[2].email,
				users[2].password,
				users[2].name,
				users[2].surname,
				users[2].plan,
				users[2].username,
			],
			'.'
		);
		expect(result1.code).toBe(0);
		expect(result2.code).toBe(0);
		await expect(
			client.login({ email: users[1].email, password: users[1].password })
		).resolves.not.toThrow();
		await expect(
			client.login({ email: users[2].email, password: users[2].password })
		).resolves.not.toThrow();
	});

	it('login to an account', async () => {
		let result = await cli(
			[
				'-a',
				users[0].accountName,
				'login',
				users[0].email,
				users[0].password,
			],
			'.'
		);

		expect(result.code).toBe(0);
		await client.login({
			email: users[0].email,
			password: users[0].password,
		});
		let token = await keytar.getPassword('Saga', users[0].accountName);
		expect(client.token).toHaveLength(token.length);
	});

	it('login to all accounts', async () => {
		let result1 = await cli(
			[
				'-a',
				users[1].accountName,
				'login',
				users[1].email,
				users[1].password,
			],
			'.'
		);
		let result2 = await cli(
			['login', users[2].email, users[2].password],
			'.'
		);

		expect(result1.code).toBe(0);
		expect(result2.code).toBe(0);

		await client.login({
			email: users[1].email,
			password: users[1].password,
		});
		let token1 = await keytar.getPassword('Saga', users[1].accountName);
		expect(client.token).toHaveLength(token1.length);

		await client.logout();
		await client.login({
			email: users[2].email,
			password: users[2].password,
		});
		let token2 = await keytar.getPassword('Saga', 'Saga');
		expect(client.token).toHaveLength(token2.length);
	});

	it('get user profile', async () => {
		let result1 = await cli(
			[
				'-a',
				users[1].accountName,
				'user',
				'get',
				users[1].email,
				users[1].password,
			],
			'.'
		);
		let result2 = await cli(
			['user', 'get', users[2].email, users[2].password],
			'.'
		);

		expect(result1.code).toBe(0);
		expect(result2.code).toBe(0);
		expect(result1.stdout).toMatch('idUser:');
		expect(result2.stdout).toMatch('idUser:');
	});

	it('update a user profile', async () => {
		let result = await cli(
			[
				'-a',
				users[0].accountName,
				'user',
				'update',
				'GG099',
				'updated@email.com',
				users[0].password,
				'Georgia',
				'Georgiou2',
				'Host',
			],
			'.'
		);

		expect(result.code).toBe(0);
		await client.login({
			email: 'updated@email.com',
			password: users[0].password,
		});
		let user = await client.getProfile();
		expect(user).toMatchObject({
			name: 'Georgia',
			surname: 'Georgiou2',
			email: 'updated@email.com',
			username: 'GG099',
			plan: 'Host',
		});
	});

	it('logout from account', async () => {
		await cli(
			[
				'-a',
				users[0].accountName,
				'logout',
				users[0].email,
				users[0].password,
			],
			'.'
		);

		let token0 = await keytar.getPassword('Saga', users[0].accountName);
		expect(token0).toBe(null);

		// the others must be intact
		await client.login({
			email: users[1].email,
			password: users[1].password,
		});
		let token1 = await keytar.getPassword('Saga', users[1].accountName);
		expect(client.token).toHaveLength(token1.length);

		await client.logout();
		await client.login({
			email: users[2].email,
			password: users[2].password,
		});
		let token2 = await keytar.getPassword('Saga', 'Saga');
		expect(client.token).toHaveLength(token2.length);
	});

	it('logout from all accounts', async () => {
		await cli(
			[
				'-a',
				users[1].accountName,
				'logout',
				users[1].email,
				users[1].password,
			],
			'.'
		);
		await cli(['logout', users[2].email, users[2].password], '.');

		let token1 = await keytar.getPassword('Saga', users[0].accountName);
		let token2 = await keytar.getPassword('Saga', 'Saga');
		expect(token1).toBe(null);
		expect(token2).toBe(null);
	});

	it('delete all accounts', async () => {
		await cli(
			['-a', users[0].accountName, 'user', 'delete', users[0].password],
			'.'
		);
		await cli(
			['-a', users[1].accountName, 'user', 'delete', users[1].password],
			'.'
		);
		await cli(['user', 'delete', users[2].password], '.');

		await expect(
			client.login({ email: users[0].email, password: users[0].password })
		).rejects.toThrow();

		let token0 = await keytar.getPassword('Saga', users[0].accountName);
		let token1 = await keytar.getPassword('Saga', users[1].accountName);
		let token2 = await keytar.getPassword('Saga', 'Saga');
		expect(token0).toBe(null);
		expect(token1).toBe(null);
		expect(token2).toBe(null);
	});
});
