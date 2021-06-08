const app = require('../../index');

const jwt = require('jsonwebtoken');
const supertest = require('supertest');
const request = supertest(app);
const { connect, db } = require('../../db');
const runQuery = require('../runQuery');

// Connect before all tests
let ids;
let jsons;
let emailToken;
beforeAll(async () => {
	await connect();
	let myQueries = [
		`INSERT INTO user VALUES (0, 'test1','test1','test1','test1','test2',0,'Free','test1');`,
		`INSERT INTO user VALUES (0, 'test1','test1','test1','test1','test2',0,'Free','test1')`,
	];
	let results = await runQuery(db.pool, myQueries);
	ids = [results[0].insertId, results[1].insertId];

	jsons = [
		{
			token: {
				process: 'registration',
				idUser: ids[0],
			},
			expires: '24h',
		},
		{
			token: {
				process: 'registration',
				idUser: ids[1],
			},
			expires: 0,
		},
	];

	emailToken = [];
	jsons.forEach(function (item) {
		emailToken.push(
			jwt.sign(item.token, process.env.EMAIL_SECRET, {
				expiresIn: item.expires,
			})
		);
	});
});

// Disconnect after all tests
afterAll(async (done) => {
	await db.pool.end();
	done();
});

describe('testing registration:', () => {
	test('valid registration GET /token/<webToken>', async () => {
		const response = await request.get('/token/' + emailToken[0]);
		expect(response.status).toBe(200);
	});

	test('valid registration GET /token/<webToken>', async () => {
		const response = await request.get('/token/' + emailToken[1]);
		expect(response.status).toBe(400);
	});
});
