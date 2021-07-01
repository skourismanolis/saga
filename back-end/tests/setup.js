const { connect, db } = require('../db');
const runQuery = require('./runQuery');
const supertest = require('supertest');
const app = require('../index');
const request = supertest(app);

module.exports = async function setup() {
	await connect();
	await runQuery(db.pool, ['DELETE FROM user WHERE idUser > 0']);
	await request.post('/users/').send({
		username: 'admin',
		email: 'admin@admin.com',
		password: 'admin',
		name: 'string',
		surname: 'string',
		picture: 'string',
		plan: 'Free',
	});

	await runQuery(db.pool, [
		'UPDATE user SET verified=1 WHERE email="admin@admin.com"',
	]);
	await db.pool.end();
};
