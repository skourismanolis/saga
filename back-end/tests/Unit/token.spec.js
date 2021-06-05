const app = require('../../index');

const jwt = require('jsonwebtoken');
const supertest = require('supertest');
const request = supertest(app);

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
		const response = await request.get('/token/' + emailToken[0]);
		console.log(response);
		expect(response.status).toBe(200);
	});

	test('expired valid registration GET /token/<webToken>', async () => {
		const response = await request.get('/token/' + emailToken[1]);
		expect(response.status).toBe(400);
	});

	test('expired valid registration GET /token/<webToken>', async () => {
		const response = await request.get('/token/' + emailToken[2]);
		expect(response.status).toBe(400);
	});
});
