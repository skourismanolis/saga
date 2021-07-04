const SagaClient = require('./index');

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

it('saves and restores login', async () => {
	let client = new SagaClient({ url: __APIURL__ });
	mockAxiosLogin(client);
	await client.login({ email: 'lor@em.com', passowrd: 'ipsum' });
	restoreAxios(client);
	expect(client.isLoggedIn).toBe(true);
	let usr = client.user;
	expect(usr).not.toBeNull();
	let tok = client.token;
	expect(tok).toBe(token);
	client.logout();
	expect(client.isLoggedIn).toBe(false);
	expect(client.token).toBeNull();
	client.setToken(tok);
	expect(client.isLoggedIn).toBe(true);
	expect(client.token).toBe(token);
	expect(client.user).toEqual(usr);
});

it('applies token', async () => {
	let client = new SagaClient({ url: __APIURL__ });
	const TOKEN = '123';
	let mock = jest.fn(async () => {
		return {};
	});
	client.axios = {
		get: mock,
	};
	await client.applyToken({ token: TOKEN });
	expect(mock.mock.calls[0][0]).toMatch(TOKEN);
});
