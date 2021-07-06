const mysql = require('mysql2/promise');

const USING_TESTING_SERVER = true;
const TESTING_SERVER_PORT = process.env.ON_DOCKER === 1 ? '3306' : '3307';
let pool = null;
let port = '3306';

module.exports = {
	async connect() {
		let host = process.env.DB_HOST || 'localhost';
		if (USING_TESTING_SERVER && process.env.NODE_ENV == 'test') {
			host = process.env.DB_TEST_HOST;
			port = TESTING_SERVER_PORT;
		}
		pool = await mysql.createPool({
			host: host,
			port: port,
			user: 'root',
			database: 'saga',
			password: 'saga1234',
			connectionLimit: 10,
		});
	},
	db: {
		get pool() {
			if (pool == null) {
				throw new Error('No connection with the database present');
			} else return pool;
		},
	},
};
