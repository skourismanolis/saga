const app = require('../../index');

// const jwt = require('jsonwebtoken');
const supertest = require('supertest');
const request = supertest(app);
const { connect, db } = require('../../db');
const runQuery = require('../runQuery');
let UserToken;

beforeAll(async () => {
	//make connection to get correct pool
	await connect();
	// let myQueries = [
	// 	`INSERT INTO user VALUES (0, 'test1','test1','test1','test1','test2',0,'Free','test1');`,
	// 	`INSERT INTO user VALUES (0, 'test1','test1','test1','test1','test2',0,'Free','test1')`,
	// ];
	// let results;
	// try {
	// 	results = await runQuery(db.pool, myQueries);
	// } catch (error) {
	// 	console.log(error);
	// }
	// ids = [results[0].insertId, results[1].insertId];
});

afterAll(async (done) => {
	await runQuery(db.pool, [
		'DELETE FROM user WHERE email = "azalea@zone10electric.com"',
	]);
	await db.pool.end();
	done();
});

describe('POST /users registration:', () => {
	test('valid registration ', async () => {
		//make request to endpoint
		const response = await request
			.post('/users')
			.send({
				username: 'string',
				email: 'azalea@zone10electric.com',
				password: 'string',
				name: 'string',
				surname: 'string',
				picture: 'string',
				plan: 'Free',
			})
			.set('Accept', 'application/json');
		expect(response.status).toBe(200);
		let results;
		try {
			results = await runQuery(db.pool, [
				'SELECT idUser FROM user WHERE email = "azalea@zone10electric.com"',
			]);
		} catch (error) {
			console.log(error);
		}
		expect(results.length).toBe(1);
	});
	test('Email exists ', async () => {
		//make request to endpoint
		const response = await request
			.post('/users')
			.send({
				username: 'string',
				email: 'azalea@zone10electric.com',
				password: 'string',
				name: 'string',
				surname: 'string',
				picture: 'string',
				plan: 'Free',
			})
			.set('Accept', 'application/json');
		expect(response.status).toBe(403);
	});
	test('Not sufficient parameters ', async () => {
		//make request to endpoint
		const response = await request
			.post('/users')
			.send({
				username: 'string',
				email: 'azalea@zone10electric.com',
				password: 'string',
			})
			.set('Accept', 'application/json');
		expect(response.status).toBe(400);
	});
});

describe('POST /users/login login:', () => {
	test('Invalid Email ', async () => {
		//make request to endpoint
		const response = await request
			.post('/users/login')
			.send({
				email: 'INVALID_EMAIL',
				password: 'string',
			})
			.set('Accept', 'application/json');
		expect(response.status).toBe(400);
	});
	test('Wrong Email ', async () => {
		//make request to endpoint
		const response = await request
			.post('/users/login')
			.send({
				email: 'WRONG_EMAIL@haha.com',
				password: 'string',
			})
			.set('Accept', 'application/json');
		expect(response.status).toBe(404);
	});
	test('Wrong Password ', async () => {
		//make request to endpoint
		const response = await request
			.post('/users/login')
			.send({
				email: 'azalea@zone10electric.com',
				password: 'WRONG_PASSWORD',
			})
			.set('Accept', 'application/json');
		expect(response.status).toBe(404);
	});
	test('Valid Login ', async () => {
		//make request to endpoint
		const response = await request
			.post('/users/login')
			.send({
				email: 'azalea@zone10electric.com',
				password: 'string',
			})
			.set('Accept', 'application/json');
		expect(response.status).toBe(200);
		UserToken = response.body.token;
	});
});

describe('PUT /users Profile settings:', () => {
	(async function () {
		const response = await request
			.post('/users/login')
			.send({
				email: 'azalea@zone10electric.com',
				password: 'string',
			})
			.set('Accept', 'application/json');
		UserToken = response.body.token;
	})();

	test('Bad Request ', async () => {
		//make request to endpoint
		const response = await request
			.put('/users')
			.send({
				username: 'string',
				email: 'azalea@zone10electric.com',
				password: 'string',
			})
			.set('Accept', 'application/json')
			.auth(UserToken, { type: 'bearer' });
		expect(response.status).toBe(400);
	});

	test('Invalid Token ', async () => {
		//make request to endpoint
		const response = await request
			.put('/users')
			.send({
				username: 'string',
				email: 'azalea@zone10electric.com',
				password: 'string',
				name: 'string',
				surname: 'string',
				picture: 'string',
				plan: 'Free',
			})
			.set('Accept', 'application/json')
			.auth('INVALID_TOKEN', { type: 'bearer' });
		expect(response.status).toBe(403);
	});

	test('Wrong Password ', async () => {
		//make request to endpoint
		const response = await request
			.put('/users')
			.send({
				username: 'string',
				email: 'azalea@zone10electric.com',
				password: 'WRONG_PASSWORD',
				name: 'string',
				surname: 'string',
				picture: 'string',
				plan: 'Free',
			})
			.set('Accept', 'application/json')
			.auth(UserToken, { type: 'bearer' });
		expect(response.status).toBe(401);
	});

	test('Change username Field ', async () => {
		//make request to endpoint
		const response = await request
			.put('/users')
			.send({
				username: 'TEST_PUT',
				email: 'azalea@zone10electric.com',
				password: 'string',
				name: 'string',
				surname: 'string',
				picture: 'string',
				plan: 'Free',
			})
			.set('Accept', 'application/json')
			.auth(UserToken, { type: 'bearer' });
		expect(response.status).toBe(200);
		let results;
		try {
			[results] = await db.pool.query(
				'SELECT * FROM user WHERE email = "azalea@zone10electric.com"'
			);
		} catch (error) {
			console.error(error);
		}
		expect(results[0].username).toBe('TEST_PUT');
	});
});
