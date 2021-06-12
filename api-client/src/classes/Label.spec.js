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

const MOCKPROJECT = {
	idProject: 2,
	title: 'asdasd',
	picture: null,
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

test('refresh', async () => {
	await expect(label.refresh()).resolves.not.toThrow();
});

test('get project', async () => {
	let mockAxios = { get: jest.fn(async () => ({ data: [MOCKPROJECT] })) };
	label.axios = mockAxios;
	await expect(label.getProject()).resolves.toBeInstanceOf(Project);
	label.axios = client.axios;
});

it('updates', async () => {
	await expect(label.update({ title: 'asdsad' })).resolves.not.toThrow();
});
