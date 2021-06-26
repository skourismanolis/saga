const { join } = require('path');
require('dotenv').config({ path: join(__dirname, '.env.test') });

module.exports = {
	roots: ['<rootDir>', '../testing/'],
	testEnvironment: 'node',
	globalSetup: './tests/setup.js',
	globals: {
		__TEST_MODE__: 'REST',
		__APIURL__: 'http://127.0.0.1:8080/',
		__APIUNAME__: 'admin@admin.com',
		__APIPWD__: 'admin',
	},
};
