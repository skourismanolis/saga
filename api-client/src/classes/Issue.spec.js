const dayjs = require('dayjs');

const SagaClient = require('../index');
const Issue = require('./Issue');
const Project = require('./Project');
const IssuePriority = require('./IssuePriority');
const Sprint = require('./Sprint');
const Column = require('./Column');

const MOCK_ISSUE = {
	idSprint: 2,
	idColumn: 2,
	idEpic: null,
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

	it('returns the project', () => {
		expect(issue.getProject()).toBeInstanceOf(Project);
	});

	it('updates fields', async () => {
		await expect(
			issue.update({ title: 'asd', description: 'testing', label: null })
		).resolves.not.toThrow();
	});

	it('returns the sprint', async () => {
		await expect(issue.getSprint()).resolves.toBeInstanceOf(Sprint);
	});

	it('returns the column', async () => {
		issue._idColumn = 2;
		let c = await issue.getColumn();
		expect(c).toBeInstanceOf(Column);
	});
});
