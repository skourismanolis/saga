const Project = require('@dira/api-client/src/classes/Project');
const PaginatedList = require('@dira/api-client/src/classes/PaginatedList');

const SagaClient = require('@dira/api-client');
describe('constructs correctly', () => {
	test('correct baseURL', () => {
		let c = new SagaClient({ url: __APIURL__ });
		expect(c.axios.defaults.baseURL).toBe(__APIURL__);
	});
});
const token =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOjMsInBsYW4iOiJGcmVlIiwiaWF0IjoxNjI0NjQ2MDIxLCJleHAiOjE2MjUyNTA4MjF9.RMn4DytOEU9FjSXpMvAO1vxV8QlD_t92tkfMlou71rg';
let ogAxios;

function mockAxiosLogin(client) {
	ogAxios = client.axios;
	client.axios = {
		post: async () => ({ data: { token } }),
		defaults: { headers: {} },
	};
}

function restoreAxios(client) {
	client.axios = ogAxios;
}

it('logins', async () => {
	let client = new SagaClient({ url: __APIURL__ });
	if (__TEST_MODE__ === 'CLIENT') {
		mockAxiosLogin(client);
	}
	await expect(
		client.login({
			email: __APIUNAME__ || 'lorem',
			password: __APIPWD__ || 'ipsum',
		})
	).resolves.not.toThrow();

	if (__TEST_MODE__ === 'CLIENT') {
		expect(client.axios.defaults.headers.Authorization).toContain(token);
		restoreAxios(client);
	}
});

describe('users', () => {
	const email = 'lorem@ipsum.com';
	const password = '1234';
	let client;
	beforeAll(async () => {
		client = new SagaClient({ url: __APIURL__ });
	});

	it('creates a user', async () => {
		await expect(
			client.register({
				username: '123',
				password,
				email,
				name: 'as',
				surname: 'asd',
				plan: 'Free',
			})
		).resolves.not.toThrow();
	});

	it('updates a user', async () => {
		if (__TEST_MODE__ === 'CLIENT') {
			mockAxiosLogin(client);
		}
		await client.login({ email, password });
		if (__TEST_MODE__ === 'CLIENT') {
			restoreAxios(client);
		}
		await expect(
			client.userEdit({
				username: '123',
				email,
				password,
				name: 'as',
				surname: 'asd',
				plan: 'Free',
			})
		).resolves.not.toThrow();
	});

	if (__TEST_MODE__ === 'CLIENT')
		it('has user payments', async () => {
			let payments = await client.getPayments();
			expect(payments).toBeInstanceOf(Array);
		});

	it('logs out', () => {
		client.logout();
		expect(client.isLoggedIn).toBe(false);
		expect(client.user).toBe(null);
	});

	it('deletes a user', async () => {
		if (__TEST_MODE__ === 'CLIENT') {
			mockAxiosLogin(client);
		}

		await client.login({ email, password });

		if (__TEST_MODE__ === 'CLIENT') {
			restoreAxios(client);
		}

		await expect(client.deleteUser({ password })).resolves.not.toThrow();
		expect(client.isLoggedIn).toBe(false);
		expect(client.user).toBe(null);
	});
});

describe('projects', () => {
	let client;
	beforeAll(async () => {
		client = new SagaClient({ url: __APIURL__ });
		if (__TEST_MODE__ === 'CLIENT') mockAxiosLogin(client);
		await client.login({
			email: __APIUNAME__ || 'asd@gmail.com',
			password: __APIPWD__ || '1234',
		});
		if (__TEST_MODE__ === 'CLIENT') restoreAxios(client);
	});

	it('creates a project', async () => {
		await expect(
			client.createProject({ title: 'lorem' })
		).resolves.toBeInstanceOf(Project);
	});

	it('returns a project list', async () => {
		let projects = await client.getProjects();

		expect(projects).toBeInstanceOf(PaginatedList);

		expect(projects.total).toBeGreaterThan(0);

		projects.content.forEach((p) => expect(p).toBeInstanceOf(Project));
	});
});
