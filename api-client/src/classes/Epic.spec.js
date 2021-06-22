const SagaClient = require('../index');
const dayjs = require('dayjs');

const Epic = require('./Epic');
const Project = require('./Project');
const Issue = require('./Issue');
const PaginatedList = require('./PaginatedList');

let client;

const ISSUEID = 33;

const MOCKEPIC = {
	idEpic: 1,
	title: 'mansd',
	start: null,
	deadline: null,
	description: 'asd',
};

const MOCKPROJECT = {
	idProject: 2,
	title: 'asdasd',
	picture: null,
};

beforeAll(() => {
	client = new SagaClient({ url: __MOCKURL__ });
});

it('constructs correctly', () => {
	expect(new Epic(client, MOCKEPIC, MOCKPROJECT.idProject)).toBeInstanceOf(
		Epic
	);
});

describe('main functions', () => {
	let epic;
	beforeAll(() => {
		epic = new Epic(client, MOCKEPIC, MOCKPROJECT.idProject);
	});

	it('returns project', async () => {
		let mockAxios = {
			get: jest.fn(async () => ({ data: [MOCKPROJECT] })),
		};
		epic.axios = mockAxios;
		await expect(epic.getProject()).resolves.toBeInstanceOf(Project);
		epic.axios = client.axios;
	});

	test('toJSON', () => {
		let epc = epic.toJSON();
		expect(epc).toBeTruthy();
		expect(() => {
			epc = JSON.parse(epc);
		}).not.toThrow();

		let matcher = { ...MOCKEPIC };

		expect(epc).toMatchObject(matcher);
	});

	test('in sprint', async () => {
		let mockAxios = {
			get: jest.fn(async () => ({ data: [MOCKPROJECT] })),
		};
		epic.axios = mockAxios;
		let project = await epic.getProject();
		epic.axios = client.axios;

		let issue = await project.getIssue(ISSUEID);
		//THIS IS BECAUSE THE MOCK SERVER IS DUMB
		issue._code = ISSUEID;
		expect(epic.includes(issue)).toBe(true);
		issue._code = 'loemrm 3-9r 9iefefj9euf';
		expect(epic.includes(issue)).toBe(false);
	});

	test('started', () => {
		expect(epic.started()).toBe(false);
		epic.start = new Date();
		expect(epic.started()).toBe(true);
	});

	test('due in', () => {
		expect(epic.dueIn()).toBe(null);
		epic.deadline = dayjs().add('1', 'month').toDate();
		expect(epic.dueIn()).toBeGreaterThan(0);
	});

	test('get all issues', async () => {
		let issues = await epic.getIssues();
		expect(issues).toBeInstanceOf(PaginatedList);
		issues.content.forEach((i) => expect(i).toBeInstanceOf(Issue));
	});

	test('add issues', async () => {
		let mockAxios = {
			get: jest.fn(async () => ({ data: [MOCKPROJECT] })),
		};
		epic.axios = mockAxios;
		let project = await epic.getProject();
		epic.axios = client.axios;

		let issue1 = await project.getIssue('asdas');
		let issue2 = await project.getIssue('aqwwsdas');

		await expect(epic.addIssues([issue1, issue2])).resolves.not.toThrow();
	});

	test('remove issues', async () => {
		let issues = await epic.getIssues();
		await expect(epic.removeIssues(issues.content)).resolves.not.toThrow();
	});

	it('refreshes', async () => {
		let mockAxios = {
			get: jest.fn(async () => ({ data: MOCKEPIC })),
		};
		epic.axios = mockAxios;
		await expect(epic.refresh()).resolves.not.toThrow();
		epic.axios = client.axios;
	});

	it('updates', async () => {
		let mockAxios = {
			get: jest.fn(async () => ({ data: MOCKEPIC })),
			put: client.axios.put,
		};
		epic.axios = mockAxios;
		await expect(epic.update({ title: 'asd' })).resolves.not.toThrow();
		epic.axios = client.axios;
	});
});
