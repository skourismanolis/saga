const Project = require('@dira/api-client/src/classes/Project');
const PaginatedList = require('@dira/api-client/src/classes/PaginatedList');

const SagaClient = require('@dira/api-client');
describe('constructs correctly', () => {
	test('correct baseURL', () => {
		let c = new SagaClient({ url: __APIURL__ });
		expect(c.axios.defaults.baseURL).toBe(__APIURL__);
	});
});

it('logins', async () => {
	let client = new SagaClient({ url: __APIURL__ });
	let og;
	const token =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOjMsInBsYW4iOiJGcmVlIiwiaWF0IjoxNjI0NjQ2MDIxLCJleHAiOjE2MjUyNTA4MjF9.RMn4DytOEU9FjSXpMvAO1vxV8QlD_t92tkfMlou71rg';
	if (__TEST_MODE__ === 'CLIENT') {
		og = client.axios;
		client.axios = {
			post: async () => ({ data: { token } }),
			defaults: { headers: {} },
		};
	}
	await expect(
		client.login({
			email: __APIUNAME__ || 'lorem',
			password: __APIPWD__ || 'ipsum',
		})
	).resolves.not.toThrow();

	if (__TEST_MODE__ === 'CLIENT') {
		expect(client.axios.defaults.headers.Authorization).toContain(token);
		client.axios = og;
	}
});

describe('projects', () => {
	let client;
	beforeAll(async () => {
		client = new SagaClient({ url: __APIURL__ });
		await client.login({
			email: __APIUNAME__ || 'asd@gmail.com',
			password: __APIPWD__ || '1234',
		});
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
