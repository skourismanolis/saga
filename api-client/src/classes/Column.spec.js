const SagaClient = require('../index');
const Column = require('./Column');
const Project = require('./Project');

let client;
let column;
const MOCKCOLUMN = { idColumn: 2, name: 'Lorem', order: 3 };

beforeAll(() => {
	client = new SagaClient({ url: __MOCKURL__ });
});

test('constructs', () => {
	column = new Column(client, MOCKCOLUMN, 2);
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

test('get project', () => {
	expect(column.getProject()).toBeInstanceOf(Project);
});

test('update', async () => {
	await expect(column.update({ name: 'asda' })).resolves.not.toThrow();
});
