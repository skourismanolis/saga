const SagaClient = require('../index');
const Label = require('./Label');
const Project = require('./Project');

let client;
let label;

const MOCKLABEL = {
	idLabel: 2,
	name: 'Frontend',
	color: '#123456',
};
beforeAll(() => {
	client = new SagaClient({ url: __MOCKURL__ });
});

it('constructs', async () => {
	label = new Label(client, MOCKLABEL, 2);
	expect(label).toBeTruthy();
});

test('id', () => {
	expect(label.id).toBe(MOCKLABEL.idLabel);
});

test('toJSON', () => {
	let lab = label.toJSON();
	expect(lab).toBeTruthy();
	expect(() => {
		lab = JSON.parse(lab);
	}).not.toThrow();

	expect(lab).toMatchObject(MOCKLABEL);
});

test('get project', () => {
	expect(label.getProject()).toBeInstanceOf(Project);
});

it('updates', async () => {
	await expect(label.update({ title: 'asdsad' })).resolves.not.toThrow();
});
