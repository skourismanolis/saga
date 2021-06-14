const mysql = require('mysql2/promise');

const USING_TESTING_SERVER = true;
const TESTING_SERVER_PORT = '3307';
let pool = null;
let port = '3306';

module.exports = {
	async connect() {
		if (USING_TESTING_SERVER && process.env.NODE_ENV == 'test') {
			port = TESTING_SERVER_PORT;
		}
		pool = await mysql.createPool({
			host: 'localhost',
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
