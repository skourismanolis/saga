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
const PaginatedList = require('@dira/api-client/src/classes/PaginatedList');
const Comment = require('@dira/api-client/src/classes/Comment');

const MOCK_ISSUE = {
	idSprint: 2,
	idColumn: 2,
	idEpic: 2,
	idLabel: 3,
	assignees: [2, 4],
	code: '2F3D',
	title: 'lorem',
	category: 'Task',
	points: 12,
	priority: IssuePriority.NEUTRAL,
	description: 'lorem ipsum dolor sit amet',
	deadline: null,
};

const MOCKPROJECT = {
	idProject: 1,
	title: 'asdasd',
	picture: null,
};

let client;
let issue;

describe('Issue', () => {
	beforeAll(async () => {
		client = new SagaClient({ url: __APIURL__ });
		if (__TEST_MODE__ === 'REST') {
			await client.login({
				email: 'random_user@test.com',
				password: 'test_member',
			});
		}
	});

	it('constructs correctly', () => {
		issue = new Issue(client, MOCK_ISSUE, 1);
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
		let is = new Issue(client, MOCK_ISSUE, 1);
		await expect(is.refresh()).resolves.not.toThrow();
	});

	it('is done', () => {
		issue._idColumn = null;
		expect(issue.isDone()).toBe(true);
	});

	it("isn't done", () => {
		let is = new Issue(client, { ...MOCK_ISSUE, idColumn: 2 }, 1);
		expect(is.isDone()).toBe(false);
	});

	it("dueIn returns null when there's no deadline", () => {
		expect(issue.dueIn()).toBe(null);
	});

	it('calculates the deadline', () => {
		let is = new Issue(client, { ...MOCK_ISSUE, deadline: '2050-01-01' });
		expect(is.dueIn()).toBeGreaterThan(0);
	});

	it('returns the project', async () => {
		if (__TEST_MODE__ === 'CLIENT') {
			let mockAxios = {
				get: jest.fn(async () => ({ data: [MOCKPROJECT] })),
			};
			issue.axios = mockAxios;
			await expect(issue.getProject()).resolves.toBeInstanceOf(Project);
			issue.axios = client.axios;
		}
		else if (__TEST_MODE__ === 'REST') {
			await expect(issue.getProject()).resolves.toBeInstanceOf(Project);
		}
	});

	it('returns assignees', async () => {
		let assignees = await issue.getAssignees();
		assignees.forEach((a) => expect(a).toBeInstanceOf(Member));
	});

	it('returns comments', async () => {
		let comments = await issue.getComments();
		expect(comments).toBeInstanceOf(PaginatedList);
		comments.content.forEach((c) => expect(c).toBeInstanceOf(Comment));
	});

	it('updates fields', async () => {
		let is = new Issue(client, MOCK_ISSUE, 1);
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
		if (__TEST_MODE__ === 'CLIENT') {
			let mockGet = async (...args) => {
				if (!args[0].includes('columns'))
					return { data: [MOCKPROJECT] };
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
		}
		else if (__TEST_MODE__ === 'REST') {
			issue._idColumn = 2;
			let c = await issue.getColumn();
			expect(c).toBeInstanceOf(Column);
		}
	});
});
