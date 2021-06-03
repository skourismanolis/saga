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
	beforeAll(() => {
		client = new SagaClient({ url: __MOCKURL__ });
	});

	it('returns a project list', async () => {
		let projects = await client.getProjects();

		expect(projects).toBeInstanceOf(PaginatedList);

		expect(projects.total).toBeGreaterThan(0);

		projects.content.forEach((p) => expect(p).toBeInstanceOf(Project));
	});
});
