const SagaClient = require('@dira/api-client');
const dayjs = require('dayjs');

const Sprint = require('@dira/api-client/src/classes/Sprint');
const Project = require('@dira/api-client/src/classes/Project');
const Issue = require('@dira/api-client/src/classes/Issue');
const PaginatedList = require('@dira/api-client/src/classes/PaginatedList');

let client;

// const ISSUEID = 33;

const MOCKSPRINT = {
	idSprint: 1,
	title: 'mansd',
	start: null,
	deadline: null,
};

const MOCKPROJECT = {
	idProject: 2,
	title: 'asdasd',
	picture: null,
};

if (__TEST_MODE__ === 'REST') {
	it('suite disabled', () => expect(1).toBe(1));
} else {
	beforeAll(() => {
		client = new SagaClient({ url: __APIURL__ });
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
			let mockAxios = {
				get: jest.fn(async () => ({ data: [MOCKPROJECT] })),
			};
			sprint.axios = mockAxios;
			await expect(sprint.getProject()).resolves.toBeInstanceOf(Project);
			sprint.axios = client.axios;
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
			let mockAxios = {
				get: jest.fn(async () => ({ data: [MOCKPROJECT] })),
			};
			sprint.axios = mockAxios;
			let project = await sprint.getProject();
			sprint.axios = client.axios;

			let issue1 = await project.getIssue('asdas');
			let issue2 = await project.getIssue('aqwwsdas');

			await expect(
				sprint.addIssues([issue1, issue2])
			).resolves.not.toThrow();
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
}
