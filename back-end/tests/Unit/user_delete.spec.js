const app = require('../../index');

// const jwt = require('jsonwebtoken');
const supertest = require('supertest');
const request = supertest(app);
const { connect, db } = require('../../db');
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
	await db.pool.end();
	done();
});

describe('Delete /users    delete_user', () => {
	test('Not Test ', async () => {
		await request
			.post('/users')
			.send({
				username: 'string',
				email: 'klaininc@gmail.com',
				password: 'string',
				name: 'string',
				surname: 'string',
				picture: 'string',
				plan: 'Free',
			})
			.set({
				'Content-Type': 'application/json',
				Accept: '*/*',
			});
		const response = await request
			.post('/users/login')
			.send({
				email: 'klaininc@gmail.com',
				password: 'string',
			})
			.set({
				'Content-Type': 'application/json',
				Accept: '*/*',
			});
		UserToken = response.body.token;
	});

	test('Bad Request ', async () => {
		//make request to endpoint
		const response = await request
			.delete('/users')
			.send({
				WRONG_FIELDS: 'string',
			})
			.set({
				'Content-Type': 'application/json',
				Accept: '*/*',
			})
			.auth(UserToken, { type: 'bearer' });
		expect(response.status).toBe(400);
	});

	test('Invalid Password ', async () => {
		//make request to endpoint
		const response = await request
			.delete('/users')
			.send({
				password: 'WRONG_PASSWORD',
			})
			.set({
				'Content-Type': 'application/json',
				Accept: '*/*',
			})
			.auth(UserToken, { type: 'bearer' });
		expect(response.status).toBe(401);
	});

	test('Valid Delete ', async () => {
		//make request to endpoint
		const response = await request
			.delete('/users')
			.send({
				password: 'string',
			})
			.set({
				'Content-Type': 'application/json',
				Accept: '*/*',
			})
			.auth(UserToken, { type: 'bearer' });
		expect(response.status).toBe(200);
		let result;
		try {
			[result] = await db.pool.query(
				`SELECT * FROM user WHERE email = "klaininc@gmail.com"`
			);
		} catch (error) {
			console.error(error);
		}
		expect(result.length).toBe(0);
	});
});
