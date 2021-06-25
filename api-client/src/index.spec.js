const Project = require('./classes/Project');
const PaginatedList = require('./classes/PaginatedList');

const SagaClient = require('./index');
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
		let og = client.axios;
		client.axios = { post: async () => ({ token: '123' }) };
		await expect(
			client.login({ email: 'lorem', password: 'ipsum' })
		).not.toThrow();
		client.axios = og;
	});

	it('returns a project list', async () => {
		let projects = await client.getProjects();

		expect(projects).toBeInstanceOf(PaginatedList);

		expect(projects.total).toBeGreaterThan(0);

		projects.content.forEach((p) => expect(p).toBeInstanceOf(Project));
	});
});
