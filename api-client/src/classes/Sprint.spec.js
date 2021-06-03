const SagaClient = require('../index');
const dayjs = require('dayjs');

const Sprint = require('./Sprint');
const Project = require('./Project');
const Issue = require('./Issue');
const PaginatedList = require('./PaginatedList');

let client;

const ISSUEID = 33;

const MOCKSPRINT = {
	idSprint: 1,
	title: 'mansd',
	start: null,
	finish: null,
	issues: [12, 32, 23, ISSUEID],
};

beforeAll(() => {
	client = new SagaClient({ url: __MOCKURL__ });
});

it('constructs correctly', () => {
	expect(new Sprint(client, MOCKSPRINT, 3)).toBeInstanceOf(Sprint);
});

describe('main functions', () => {
	let sprint;
	beforeAll(() => {
		sprint = new Sprint(client, MOCKSPRINT, 3);
	});

	it('returns project', () => {
		expect(sprint.getProject()).toBeInstanceOf(Project);
	});

	test('in sprint', async () => {
		let project = sprint.getProject();
		let issue = await project.getIssue(ISSUEID);
		//THIS IS BECAUSE THE MOCK SERVER IS DUMB
		issue._code = ISSUEID;
		expect(sprint.inSprint(issue)).toBe(true);
		issue._code = 'loemrm 3-9r 9iefefj9euf';
		expect(sprint.inSprint(issue)).toBe(false);
	});

	test('started', () => {
		expect(sprint.started()).toBe(false);
		sprint.start = new Date();
		expect(sprint.started()).toBe(true);
	});

	test('due in', () => {
		expect(sprint.dueIn()).toBe(null);
		sprint.finish = dayjs().add('1', 'month').toDate();
		expect(sprint.dueIn()).toBeGreaterThan(0);
	});

	test('get all issues', async () => {
		let issues = await sprint.getIssues();
		expect(issues).toBeInstanceOf(PaginatedList);
		issues.content.forEach((i) => expect(i).toBeInstanceOf(Issue));
	});

	test('add issues', async () => {
		let project = sprint.getProject();
		let issue1 = await project.getIssue('asdas');
		let issue2 = await project.getIssue('aqwwsdas');

		await expect(sprint.addIssues([issue1, issue2])).resolves.not.toThrow();
	});

	test('remove issues', async () => {
		let issues = await sprint.getIssues();
		await expect(
			sprint.removeIssues(issues.content)
		).resolves.not.toThrow();
	});

	it('updates', async () => {
		await expect(
			sprint.update({ start: new Date() })
		).resolves.not.toThrow();
	});
});
