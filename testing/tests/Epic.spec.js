const SagaClient = require('@dira/api-client');
const dayjs = require('dayjs');

const Epic = require('@dira/api-client/src/classes/Epic');
const Project = require('@dira/api-client/src/classes/Project');
const Issue = require('@dira/api-client/src/classes/Issue');
const PaginatedList = require('@dira/api-client/src/classes/PaginatedList');

let client;

const MOCKEPIC = {
	idEpic: 3,
	title: 'mansd',
	start: null,
	deadline: null,
	description: 'asd',
};

const MOCKPROJECT = {
	idProject: 1,
	title: 'asdasd',
	picture: null,
};

beforeAll(async () => {
	client = new SagaClient({ url: __APIURL__ });
});

it('constructs correctly', () => {
	expect(new Epic(client, MOCKEPIC, MOCKPROJECT.idProject)).toBeInstanceOf(
		Epic
	);
});

describe('main functions', () => {
	let epic;
	beforeAll(async () => {
		epic = new Epic(client, MOCKEPIC, MOCKPROJECT.idProject);
		if (__TEST_MODE__ === 'REST') {
			await client.login({
				email: 'random_user@test.com',
				password: 'test_member',
			});
		}
	});

	it('returns project', async () => {
		if (__TEST_MODE__ === 'CLIENT') {
			let mockAxios = {
				get: jest.fn(async () => ({ data: [MOCKPROJECT] })),
			};
			epic.axios = mockAxios;
		}
		await expect(epic.getProject()).resolves.toBeInstanceOf(Project);
		if (__TEST_MODE__ === 'CLIENT') epic.axios = client.axios;
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
		if (__TEST_MODE__ === 'CLIENT') {
			let mockAxios = {
				get: jest.fn(async () => ({ data: [MOCKPROJECT] })),
			};
			epic.axios = mockAxios;
		}
		let project = await epic.getProject();
		if (__TEST_MODE__ === 'CLIENT') epic.axios = client.axios;

		let issue1 = await project.getIssue('asdas');
		let issue2 = await project.getIssue('aqwwsdas');

		await expect(epic.addIssues([issue1, issue2])).resolves.not.toThrow();
	});

	test('remove issues', async () => {
		let issues = await epic.getIssues();
		await expect(epic.removeIssues(issues.content)).resolves.not.toThrow();
	});

	it('refreshes', async () => {
		if (__TEST_MODE__ === 'CLIENT') {
			let mockAxios = {
				get: jest.fn(async () => ({ data: MOCKEPIC })),
			};
			epic.axios = mockAxios;
		}
		await expect(epic.refresh()).resolves.not.toThrow();
		if (__TEST_MODE__ === 'CLIENT') epic.axios = client.axios;
	});

	it('updates', async () => {
		if (__TEST_MODE__ === 'CLIENT') {
			let mockAxios = {
				get: jest.fn(async () => ({ data: MOCKEPIC })),
				put: client.axios.put,
			};
			epic.axios = mockAxios;
		}
		await expect(epic.update({ title: 'asd' })).resolves.not.toThrow();
		if (__TEST_MODE__ === 'CLIENT') epic.axios = client.axios;
	});
});
