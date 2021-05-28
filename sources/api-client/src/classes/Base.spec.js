const Base = require('./Base');
const SagaClient = require('../index');

describe('Base class works', () => {
	let client;

	beforeAll(() => {
		client = new SagaClient({ url: '' });
	});

	test('exposes axios', () => {
		let b = new Base(client);
		expect(b.axios).not.toBeFalsy();
	});
});
