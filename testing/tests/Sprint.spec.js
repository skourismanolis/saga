const SagaClient = require('@dira/api-client');
const dayjs = require('dayjs');

const Sprint = require('@dira/api-client/src/classes/Sprint');
const Project = require('@dira/api-client/src/classes/Project');
const Issue = require('@dira/api-client/src/classes/Issue');
const PaginatedList = require('@dira/api-client/src/classes/PaginatedList');

let client;

const MOCKSPRINT = {
	idSprint: 3,
	title: 'sprint_1',
	start: null,
	deadline: null,
};

const MOCKPROJECT = {
	idProject: 2,
	title: 'project2',
	picture: null,
};

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
	expect(
		new Sprint(client, MOCKSPRINT, MOCKPROJECT.idProject)
	).toBeInstanceOf(Sprint);
});

describe('main functions', () => {
	let sprint;
	beforeAll(() => {
		sprint = new Sprint(client, MOCKSPRINT, MOCKPROJECT.idProject);
	});

	it('returns project', async () => {
		if (__TEST_MODE__ === 'CLIENT') {
			let mockAxios = {
				get: jest.fn(async () => ({ data: [MOCKPROJECT] })),
			};
			sprint.axios = mockAxios;
			await expect(sprint.getProject()).resolves.toBeInstanceOf(Project);
			sprint.axios = client.axios;
		} else if (__TEST_MODE__ === 'REST') {
			await expect(sprint.getProject()).resolves.toBeInstanceOf(Project);
		}
	});

	test('toJSON', () => {
		let spr = sprint.toJSON();
		expect(spr).toBeTruthy();
		expect(() => {
			spr = JSON.parse(spr);
		}).not.toThrow();

		let matcher = { ...MOCKSPRINT };

		expect(spr).toMatchObject(matcher);
	});

	// test('in sprint', async () => {
	// 	let mockAxios = {
	// 		get: jest.fn(async () => ({ data: [MOCKPROJECT] })),
	// 	};
	// 	sprint.axios = mockAxios;
	// 	let project = await sprint.getProject();
	// 	sprint.axios = client.axios;

	// 	let issue = await project.getIssue(ISSUEID);
	// 	//THIS IS BECAUSE THE MOCK SERVER IS DUMB
	// 	issue._code = ISSUEID;
	// 	expect(sprint.includes(issue)).toBe(true);
	// 	issue._code = 'loemrm 3-9r 9iefefj9euf';
	// 	expect(sprint.includes(issue)).toBe(false);
	// });

	test('started', () => {
		expect(sprint.started()).toBe(false);
		sprint.start = new Date();
		expect(sprint.started()).toBe(true);
	});

	test('due in', () => {
		expect(sprint.dueIn()).toBe(null);
		sprint.deadline = dayjs().add('1', 'month').toDate();
		expect(sprint.dueIn()).toBeGreaterThan(0);
	});

	test('get all issues', async () => {
		let issues = await sprint.getIssues();
		expect(issues).toBeInstanceOf(PaginatedList);
		issues.content.forEach((i) => expect(i).toBeInstanceOf(Issue));
	});

	test('add issues', async () => {
		let project;
		if (__TEST_MODE__ === 'CLIENT') {
			let mockAxios = {
				get: jest.fn(async () => ({ data: [MOCKPROJECT] })),
			};
			sprint.axios = mockAxios;
			project = await sprint.getProject();
			sprint.axios = client.axios;
		} else if (__TEST_MODE__ === 'REST') {
			project = await sprint.getProject();
		}

		// console.log(sprint);
		let issue1 = await project.getIssue('issue1');
		let issue2 = await project.getIssue('issue2');

		await expect(sprint.addIssues([issue1, issue2])).resolves.not.toThrow();
	});

	test('remove issues', async () => {
		let issues = await sprint.getIssues();
		await expect(
			sprint.removeIssues(issues.content)
		).resolves.not.toThrow();
	});

	it('refreshes', async () => {
		let mockAxios = {
			get: jest.fn(async () => ({ data: MOCKSPRINT })),
		};
		sprint.axios = mockAxios;
		await expect(sprint.refresh()).resolves.not.toThrow();
		sprint.axios = client.axios;
	});

	it('updates', async () => {
		let mockAxios = {
			get: jest.fn(async () => ({ data: MOCKSPRINT })),
			put: client.axios.put,
		};
		sprint.axios = mockAxios;
		await expect(
			sprint.update({ start: new Date() })
		).resolves.not.toThrow();
		sprint.axios = client.axios;
	});
});
