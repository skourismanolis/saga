const SagaClient = require('../index');
const Project = require('./Project');
const Member = require('./Member');
const Label = require('./Label');

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
