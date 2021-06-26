const dayjs = require('dayjs');

const SagaClient = require('@dira/api-client');
const Issue = require('@dira/api-client/src/classes/Issue');
const Project = require('@dira/api-client/src/classes/Project');
const IssuePriority = require('@dira/api-client/src/classes/IssuePriority');
const Sprint = require('@dira/api-client/src/classes/Sprint');
const Column = require('@dira/api-client/src/classes/Column');
const Label = require('@dira/api-client/src/classes/Label');
const Member = require('@dira/api-client/src/classes/Member');
const Epic = require('@dira/api-client/src/classes/Epic');

const MOCK_ISSUE = {
	idSprint: 2,
	idColumn: 2,
	idEpic: 2,
	idLabel: 3,
	assignees: [1, 2, 3],
	code: '2F3D',
	title: 'lorem',
	category: 'Task',
	points: 12,
	priority: IssuePriority.NEUTRAL,
	description: 'lorem ipsum dolor sit amet',
	deadline: dayjs().add(1, 'month').toISOString(),
};

const MOCKPROJECT = {
	idProject: 2,
	title: 'asdasd',
	picture: null,
};

let client;
let issue;
describe('Issue', () => {
	beforeAll(() => {
		client = new SagaClient({ url: __MOCKURL__ });
	});

	it('constructs correctly', () => {
		issue = new Issue(client, MOCK_ISSUE, 2);
		expect(issue).toBeTruthy();
	});

	it('has toJSON', () => {
		let is = issue.toJSON();
		expect(is).toBeTruthy();
		expect(() => {
			is = JSON.parse(is);
		}).not.toThrow();

		expect(is).toMatchObject(MOCK_ISSUE);
	});

	it('refreshes', async () => {
		let is = new Issue(client, MOCK_ISSUE, 2);
		await expect(is.refresh()).resolves.not.toThrow();
	});

	it('is done', () => {
		issue._idColumn = null;
		expect(issue.isDone()).toBe(true);
	});

	it("isn't done", () => {
		let is = new Issue(client, { ...MOCK_ISSUE, idColumn: 2 }, 2);
		expect(is.isDone()).toBe(false);
	});

	it('calculates the deadline', () => {
		expect(issue.dueIn()).toBeGreaterThan(0);
	});

	test("dueIn returns null when there's no deadline", () => {
		let is = new Issue(client, { ...MOCK_ISSUE, deadline: null });
		expect(is.dueIn()).toBe(null);
	});

	it('returns the project', async () => {
		let mockAxios = {
			get: jest.fn(async () => ({ data: [MOCKPROJECT] })),
		};
		issue.axios = mockAxios;
		await expect(issue.getProject()).resolves.toBeInstanceOf(Project);
		issue.axios = client.axios;
	});

	it('returns assignees', async () => {
		let assignees = await issue.getAssignees();
		assignees.forEach((a) => expect(a).toBeInstanceOf(Member));
	});

	it('updates fields', async () => {
		let is = new Issue(client, MOCK_ISSUE, 2);

		await expect(
			is.update({ title: 'asd', description: 'testing', label: null })
		).resolves.not.toThrow();
	});

	it('returns the sprint', async () => {
		await expect(issue.getSprint()).resolves.toBeInstanceOf(Sprint);
	});

	it('returns the epic', async () => {
		await expect(issue.getEpic()).resolves.toBeInstanceOf(Epic);
	});

	it('returns the label', async () => {
		await expect(issue.getLabel()).resolves.toBeInstanceOf(Label);
	});

	it('returns the column', async () => {
		let mockGet = async (...args) => {
			if (!args[0].includes('columns')) return { data: [MOCKPROJECT] };
			else return client.axios.get(args);
		};
		let mockAxios = {
			get: jest.fn(mockGet),
		};
		issue.axios = mockAxios;
		issue._idColumn = 2;
		let c = await issue.getColumn();
		expect(c).toBeInstanceOf(Column);
		issue.axios = client.axios;
	});
});
