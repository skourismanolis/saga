const mysql = require('mysql2/promise');

const USING_TESTING_SERVER = true;
let pool = null;
let database = 'saga';

module.exports = {
	async connect() {
		if (USING_TESTING_SERVER && process.env.NODE_ENV == 'test') {
			database = 'saga2';
		}
		pool = await mysql.createPool({
			host: 'localhost',
			port: '3306',
			user: 'root',
			database: database,
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
