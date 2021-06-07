const app = require('../../index');

const jwt = require('jsonwebtoken');
const supertest = require('supertest');
const request = supertest(app);
const { connect, db } = require('../../db');

// Connect before all tests
beforeAll(async () => {
	await connect();
});

// Disconnect after all tests
afterAll(async (done) => {
	await db.pool.end();
	done();
});

let jsons = [
	{
		token: {
			process: 'registration',
			idUser: 0,
		},
		expires: '24h',
	},
	{
		token: {
			process: 'registration',
			idUser: 0,
		},
		expires: 0,
	},
	{
		token: {
			process: 'registration',
			idUser: -1,
		},
		expires: '24h',
	},
];

let emailToken = [];
jsons.forEach(function (item) {
	emailToken.push(
		jwt.sign(item.token, process.env.EMAIL_SECRET, {
			expiresIn: item.expires,
		})
	);
});

describe('testing registration:', () => {
	test('valid registration GET /token/<webToken>', async () => {
		const response = await request.get('/token/');
		expect(response.status).toBe(200);
	});

	test('valid registration GET /token/<webToken>', async () => {
		const response = await request.get('/token/');
		expect(response.status).toBe(200);
	});
});
