const SagaClient = require('../index');
const Project = require('./Project');
const Member = require('./Member');
const Label = require('./Label');
const Issue = require('./Issue');
const Sprint = require('./Sprint.js');
const PaginatedList = require('./PaginatedList');
const IssueCategory = require('./IssueCategory');
const IssuePriority = require('./IssuePriority');
const Column = require('./Column');

let project;

const IDPROJECT = 3;

beforeAll(() => {
	let client = new SagaClient({ url: __MOCKURL__ });
	project = new Project(client, IDPROJECT);
});

test('project constructor', () => {
	expect(project.id).toBe(IDPROJECT);
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

test('updates', async () => {
	await expect(
		project.update({ title: 'test', picture: 'http://google.com' })
	).resolves.toBeUndefined();
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
	it('deletes an issue', async () => {
		let issue = await project.getIssue('asd');
		await expect(project.deleteIssue(issue)).resolves.not.toThrow();
	});
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
