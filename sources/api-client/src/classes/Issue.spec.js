const dayjs = require('dayjs');

const SagaClient = require('../index');
const Issue = require('./Issue');

const MOCK_ISSUE = {
	idProject: 2,
	idSprint: 2,
	idColumn: null,
	idEpic: null,
	idLabel: null,
	assignees: null,
	code: '2F3D',
	title: 'lorem',
	category: 'Task',
	points: null,
	priority: 'Normal',
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
		issue = new Issue(client, MOCK_ISSUE);
		expect(issue).toBeTruthy();
	});

	it('is done', () => {
		expect(issue.isDone()).toBe(true);
	});

	it("isn't done", () => {
		let is = new Issue(client, { ...MOCK_ISSUE, idColumn: 2 });
		expect(is.isDone()).toBe(false);
	});

	it('calculates the deadline', () => {
		expect(issue.dueIn()).toBeGreaterThan(0);
	});
	test("dueIn returns null when there's no deadline", () => {
		let is = new Issue(client, { ...MOCK_ISSUE, deadline: null });
		expect(is.dueIn()).toBe(null);
	});
});
