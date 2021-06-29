const Comment = require('./Comment');
const SagaClient = require('../index');

const MOCKCOMMENT = {
	idComment: 123,
	idUser: 12,
	content: 'lorem',
	timestamp: new Date().toISOString(),
};

describe('comment class works', () => {
	let client;

	beforeAll(() => {
		client = new SagaClient({ url: '' });
	});

	test('id', () => {
		let c = new Comment(client, MOCKCOMMENT);
		expect(c.id).toBe(MOCKCOMMENT.idComment);
	});

	test('to JSON', () => {
		let c = new Comment(client, MOCKCOMMENT);
		expect(c.toJSON()).toBe(JSON.stringify(MOCKCOMMENT));
	});
});
