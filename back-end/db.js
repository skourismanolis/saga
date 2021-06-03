const mysql = require('mysql2/promise');
let pool = null;

module.exports = {
	async connect() {
		pool = await mysql.createPool({
			host: 'localhost',
			port: '3306',
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
