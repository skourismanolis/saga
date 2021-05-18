const Project = require('./classes/project');
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

	test('returns projects', async () => {
		let projects = await client.getProjects();
		expect(projects).toBeInstanceOf(Array);
		expect(projects.length).toBeGreaterThan(0);
		let project = projects[0];
		expect(project).not.toBeFalsy();
		expect(project).toBeInstanceOf(Project);
	});
});
