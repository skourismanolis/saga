const SagaClient = require('@dira/api-client');
const Label = require('@dira/api-client/src/classes/Label');
const Project = require('@dira/api-client/src/classes/Project');

let client;
let label;

const MOCKLABEL = {
	idLabel: 1,
	name: 'Frontend',
	color: '#123456',
};

const MOCKPROJECT = {
	idProject: 1,
	title: 'asdasd',
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

it('constructs', async () => {
	label = new Label(client, MOCKLABEL, 1);
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
	if (__TEST_MODE__ === 'CLIENT') {
		let mockAxios = { get: jest.fn(async () => ({ data: [MOCKPROJECT] })) };
		label.axios = mockAxios;
	}
	await expect(label.getProject()).resolves.toBeInstanceOf(Project);
	if (__TEST_MODE__ === 'CLIENT') {
		label.axios = client.axios;
	}
});

it('updates', async () => {
	await expect(label.update({ name: 'asdsad' })).resolves.not.toThrow();
});
