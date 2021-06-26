const Project = require('@dira/api-client/src/classes/Project');
const PaginatedList = require('@dira/api-client/src/classes/PaginatedList');

const SagaClient = require('@dira/api-client');
describe('constructs correctly', () => {
	test('correct baseURL', () => {
		let c = new SagaClient({ url: __MOCKURL__ });
		expect(c.axios.defaults.baseURL).toBe(__MOCKURL__);
	});
});

describe('projects', () => {
	let client;
	beforeAll(async () => {
		client = new SagaClient({ url: __MOCKURL__ });
		await client.login({ email: 'asd@gmail.com', password: '1234' });
	});

	it('logins', async () => {
		const token = 123;
		let og = client.axios;
		client.axios = {
			post: async () => ({ data: { token } }),
			defaults: { headers: {} },
		};
		await expect(
			client.login({ email: 'lorem', password: 'ipsum' })
		).resolves.not.toThrow();

		expect(client.axios.defaults.headers.Authorization).toContain(token);
		client.axios = og;
	});

	it('returns a project list', async () => {
		let projects = await client.getProjects();

		expect(projects).toBeInstanceOf(PaginatedList);

		expect(projects.total).toBeGreaterThan(0);

		projects.content.forEach((p) => expect(p).toBeInstanceOf(Project));
	});
});
