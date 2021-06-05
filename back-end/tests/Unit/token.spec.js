const app = require('../../index');

const supertest = require('supertest');
const request = supertest(app);

describe('Token handling testing functions', () => {
	test('GET /', async () => {
		const response = await request.get('/');

		expect(response.status).toBe(200);
		expect(response.text).toBe('Welcome to Saga');
	});
});
