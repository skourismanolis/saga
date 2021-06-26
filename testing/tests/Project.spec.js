const URL = require('url').URL;

const SagaClient = require('@dira/api-client');
const Project = require('@dira/api-client/src/classes/Project');
const Member = require('@dira/api-client/src/classes/Member');
const Label = require('@dira/api-client/src/classes/Label');
const Issue = require('@dira/api-client/src/classes/Issue');
const Sprint = require('@dira/api-client/src/classes/Sprint.js');
const PaginatedList = require('@dira/api-client/src/classes/PaginatedList');
const IssueCategory = require('@dira/api-client/src/classes/IssueCategory');
const IssuePriority = require('@dira/api-client/src/classes/IssuePriority');
const Column = require('@dira/api-client/src/classes/Column');
const Epic = require('@dira/api-client/src/classes/Epic');

let project;
let client;

const MOCKPROJECT = {
	idProject: 2,
	title: 'asdasd',
	picture: null,
};

beforeAll(() => {
	client = new SagaClient({ url: __APIURL__ });
	project = new Project(client, MOCKPROJECT);
});

test('project constructor', () => {
	expect(project.id).toBe(MOCKPROJECT.idProject);
});

test('members', async () => {
	let members = await project.getMembers();
	expect(members.length).toBeGreaterThan(0);
	members.forEach((member) => expect(member).toBeInstanceOf(Member));

	let admins = await project.getAdmins();
	let nonAdmins = await project.getNonAdmins();
	expect(admins.length).toBeGreaterThan(0);
	admins.forEach((member) => expect(member).toBeInstanceOf(Member));
	expect(nonAdmins.length).toBeGreaterThan(0);
	nonAdmins.forEach((member) => expect(member).toBeInstanceOf(Member));
});

test('refresh', async () => {
	let mockAxios = {
		get: jest.fn(async () => ({ data: [MOCKPROJECT] })),
	};
	project.axios = mockAxios;
	await expect(project.refresh()).resolves.not.toThrow();
	project.axios = client.axios;
});

test('updates', async () => {
	let mockAxios = {
		get: jest.fn(async () => ({ data: [MOCKPROJECT] })),
		put: client.axios.put,
	};
	project.axios = mockAxios;
	await expect(
		project.update({ title: 'test', picture: 'http://google.com' })
	).resolves.not.toThrow();
	project.axios = client.axios;
});

test('toJSON', () => {
	let proj = project.toJSON();
	expect(proj).toBeTruthy();
	expect(() => {
		proj = JSON.parse(proj);
	}).not.toThrow();

	expect(proj).toMatchObject(MOCKPROJECT);
});

describe('labels', () => {
	it('lists all labels', async () => {
		let labels = await project.getLabels();
		labels.forEach((l) => expect(l).toBeInstanceOf(Label));
	});

	it('creates a new label', async () => {
		let label = await project.createLabel({
			name: 'lorem',
			color: '#123456',
		});
		expect(label).toBeInstanceOf(Label);
	});

	it('deletes existing label', async () => {
		let label = await project.createLabel({
			name: 'lorem',
			color: '#123456',
		});
		await expect(project.deleteLabel(label)).resolves.not.toThrow();
	});
});

describe('issues', () => {
	it('creates new issue', async () => {
		await expect(
			project.createIssue({
				title: 'asdsd',
				category: IssueCategory.STORY,
				points: 1,
				priority: IssuePriority.NEUTRAL,
			})
		).resolves.toBeInstanceOf(Issue);
	});

	it('returns a specific issue', async () => {
		await expect(project.getIssue('12H')).resolves.toBeInstanceOf(Issue);
	});

	it('deletes an issue', async () => {
		let issue = await project.getIssue('asd');
		await expect(project.deleteIssue(issue)).resolves.not.toThrow();
	});
});

describe('issue search', () => {
	/**
	 * Enables axios mocking. Highjacks search urls with query parameters and modifies
	 * the results to match the query.
	 */
	function enableMock() {
		let mockAxios = async (...args) => {
			let resp = await originalAxios(...args);
			let reqURL = new URL(args[0].url, originalAxios.defaults.baseURL);

			if (reqURL.searchParams.get('inSprint') != null) {
				resp.data = resp.data.map((issue) => ({
					...issue,
					idSprint: reqURL.searchParams.get('inSprint'),
				}));
			}

			//set the idLabel of every issue to be one of the idLabels included the query
			if (reqURL.searchParams.get('labels') != null) {
				//parse labels string into array of numbers
				let labels = reqURL.searchParams.get('labels');
				labels = decodeURIComponent(labels);
				labels = labels.split(',');
				labels = labels.map((l) => Number(l));

				//assign a random label to every issue

				let randomNumber = Math.floor(Math.random() * 1000);

				resp.data = resp.data.map((issue) => ({
					...issue,
					idLabel: labels[randomNumber % (labels.length - 1)],
				}));
			}

			if (reqURL.searchParams.get('assignee') != null) {
				resp.data = resp.data.map((issue) => {
					let assignees = issue.assignees;
					let assigneeId = Number(
						reqURL.searchParams.get('assignee')
					);
					if (assignees == null) {
						assignees = [assigneeId];
					} else {
						assignees = [...assignees, assigneeId];
					}

					return {
						...issue,
						assignees,
					};
				});
			}

			if (reqURL.searchParams.get('column') != null) {
				let columnId = Number(reqURL.searchParams.get('column'));

				resp.data = resp.data.map((issue) => ({
					...issue,
					idColumn: columnId,
				}));
			}

			if (reqURL.searchParams.get('inEpic') != null) {
				let epicId = Number(reqURL.searchParams.get('inEpic'));

				resp.data = resp.data.map((issue) => ({
					...issue,
					idEpic: epicId,
				}));
			}
			return resp;
		};

		project.axios = mockAxios;
		project.client.axios = mockAxios;
	}

	/**
	 * Restores axios to the unmocked version
	 */
	function disableMock() {
		project.axios = originalAxios;
		project.client.axios = originalAxios;
	}

	let originalAxios;
	beforeAll(() => {
		originalAxios = client.axios;
		enableMock();
	});

	test('no search', async () => {
		await expect(project.searchIssues({})).resolves.toBeInstanceOf(
			PaginatedList
		);
	});

	test('inSprint', async () => {
		disableMock();
		let sprints = await project.getSprints();
		enableMock();

		let issues = await project.searchIssues({
			inSprint: sprints.content[0],
		});
		expect(issues).toBeInstanceOf(PaginatedList);
		issues.content.map((i) => expect(i).toBeInstanceOf(Issue));
		issues.content.map((i) =>
			expect(Number(i._idSprint)).toBe(sprints.content[0].id)
		);
	});

	test('labels', async () => {
		disableMock();
		let labels = await project.getLabels();
		enableMock();

		let issues = await project.searchIssues({
			labels: labels,
		});

		expect(issues).toBeInstanceOf(PaginatedList);
		issues.content.map((i) => expect(i).toBeInstanceOf(Issue));
		let labelIds = labels.map((l) => l.id);

		issues.content.map((i) => expect(labelIds).toContain(i._idLabel));
	});

	test('assignee', async () => {
		disableMock();
		let members = await project.getMembers();
		enableMock();

		let issues = await project.searchIssues({
			assignee: members[0],
		});
		expect(issues).toBeInstanceOf(PaginatedList);
		issues.content.map((i) => expect(i).toBeInstanceOf(Issue));
		issues.content.map((i) =>
			expect(i._assigneeIds).toContain(members[0].id)
		);
	});

	test('column', async () => {
		disableMock();
		let columns = await project.getColumns();
		enableMock();

		let issues = await project.searchIssues({
			column: columns[0],
		});
		expect(issues).toBeInstanceOf(PaginatedList);
		issues.content.map((i) => expect(i).toBeInstanceOf(Issue));
		issues.content.map((i) => expect(i._idColumn).toBe(columns[0].id));
	});

	test('search', async () => {
		enableMock();

		let issues = await project.searchIssues({
			search: 'asd',
		});
		expect(issues).toBeInstanceOf(PaginatedList);
		issues.content.map((i) => expect(i).toBeInstanceOf(Issue));
	});

	test('inEpic', async () => {
		disableMock();
		let epics = await project.getEpics();
		enableMock();

		let issues = await project.searchIssues({
			inEpic: epics.content[0],
		});
		expect(issues).toBeInstanceOf(PaginatedList);
		issues.content.map((i) => expect(i).toBeInstanceOf(Issue));
		issues.content.map((i) =>
			expect(Number(i._idEpic)).toBe(epics.content[0].id)
		);
	});

	afterAll(() => disableMock());
});

describe('sprints', () => {
	it('creates a new sprint', async () => {
		await expect(
			project.createSprint({ title: 'asdas' })
		).resolves.toBeInstanceOf(Sprint);
	});

	it('returns a list of sprints', async () => {
		let sprints = await project.getSprints();
		expect(sprints).toBeInstanceOf(PaginatedList);
		sprints.content.forEach((s) => expect(s).toBeInstanceOf(Sprint));
	});

	it('deletes a sprint', async () => {
		let sprints = await project.getSprints();

		await expect(
			project.deleteSprint(sprints.content[0])
		).resolves.not.toThrow();
	});
});

describe('epics', () => {
	it('creates a new epic', async () => {
		await expect(
			project.createEpic({ title: 'asdas' })
		).resolves.toBeInstanceOf(Epic);
	});

	it('returns a list of epics', async () => {
		let epics = await project.getEpics();
		expect(epics).toBeInstanceOf(PaginatedList);
		epics.content.forEach((s) => expect(s).toBeInstanceOf(Epic));
	});

	it('deletes a epic', async () => {
		let epics = await project.getEpics();

		await expect(
			project.deleteEpic(epics.content[0])
		).resolves.not.toThrow();
	});
});

describe('columns', () => {
	it('creates a new column', async () => {
		await expect(
			project.createColumn({ name: 'asdas', order: 2 })
		).resolves.toBeInstanceOf(Column);
	});

	it('returns a list of columns', async () => {
		let columns = await project.getColumns();
		columns.forEach((s) => expect(s).toBeInstanceOf(Column));
	});

	it('returns a specific column', async () => {
		let column = await project.getColumn(123);
		expect(column).toBeInstanceOf(Column);
	});

	it('deletes a column', async () => {
		let columns = await project.getColumns();
		await expect(project.deleteColumn(columns[0])).resolves.not.toThrow();
	});
});