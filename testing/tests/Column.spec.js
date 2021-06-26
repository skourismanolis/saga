const SagaClient = require('@dira/api-client');
const Column = require('@dira/api-client/src/classes/Column');
const Project = require('@dira/api-client/src/classes/Project');

let client;
let column;
const MOCKCOLUMN = { idColumn: 2, name: 'Lorem', order: 3 };

const MOCKPROJECT = {
	idProject: 2,
	title: 'asdasd',
	picture: null,
};

beforeAll(() => {
	client = new SagaClient({ url: __APIURL__ });
});

test('constructs', () => {
	column = new Column(client, MOCKCOLUMN, MOCKPROJECT.idProject);
	expect(column).toBeInstanceOf(Column);
});

test('id', () => {
	expect(column.id).toBeTruthy();
});

test('toJSON', () => {
	let col = column.toJSON();
	expect(col).toBeTruthy();
	expect(() => {
		col = JSON.parse(col);
	}).not.toThrow();

	expect(col).toMatchObject(MOCKCOLUMN);
});

test('refresh', async () => {
	await expect(column.refresh()).resolves.not.toThrow();
});

test('get project', async () => {
	let mockAxios = { get: jest.fn(async () => ({ data: [MOCKPROJECT] })) };
	column.axios = mockAxios;
	await expect(column.getProject()).resolves.toBeInstanceOf(Project);
	column.axios = client.axios;
});

test('update', async () => {
	await expect(column.update({ name: 'asda' })).resolves.not.toThrow();
});
