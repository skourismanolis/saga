const app = require('../../index');

const jwt = require('jsonwebtoken');
const supertest = require('supertest');
const request = supertest(app);
const { connect, db } = require('../../db');
const runQuery = require('../runQuery');

let ids;
let jsons;
let emailToken;

beforeAll(async () => {
	//make connection to get correct pool
	await connect();
	let myQueries = [
		`INSERT INTO user VALUES (0, 'test1','test1','test1','test1','test2',0,'Free','test1');`,
		`INSERT INTO user VALUES (0, 'test1','test1','test1','test1','test2',0,'Free','test1')`,
	];
	let results;
	try {
		results = await runQuery(db.pool, myQueries);
	} catch (error) {
		console.log(error);
	}
	ids = [results[0].insertId, results[1].insertId];

	jsons = [
		//should work
		{
			token: {
				process: 'registration',
				idUser: ids[0],
			},
			expires: '24h',
		},
		//expired
		{
			token: {
				process: 'registration',
				idUser: ids[1],
			},
			expires: 0,
		},
		//invalid process
		{
			token: {
				process: 'test',
				idUser: ids[1],
			},
			expires: 0,
		},
		//non existing idUser
		{
			token: {
				process: 'registration',
				idUser: 999999,
			},
			expires: '24h',
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
afterAll(async () => {
	await db.pool.end();
});

describe('GET /token/<webToken> registration:', () => {
	test('valid registration ', async () => {
		//make request to endpoint
		const response = await request.get('/token/' + emailToken[0]);
		expect(response.status).toBe(200);

		//check if actually changed
		let results = await runQuery(db.pool, [
			`SELECT verified FROM user WHERE idUser = ${ids[0]};`,
		]);
		expect(results[0][0].verified).toBe(1);
	});

	test('expired jwt', async () => {
		const response = await request.get('/token/' + emailToken[1]);
		expect(response.status).toBe(400);
	});

	test('invalid process', async () => {
		const response = await request.get('/token/' + emailToken[2]);
		expect(response.status).toBe(400);
	});

	test('non existing user', async () => {
		const response = await request.get('/token/' + emailToken[3]);
		expect(response.status).toBe(404);
	});
});
