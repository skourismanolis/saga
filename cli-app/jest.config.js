// const { join } = require('path');
// require('dotenv').config({ path: join(__dirname, '.env.test') });

module.exports = {
	roots: ['<rootDir>'],
	testEnvironment: 'node',
	globalSetup: '../back-end/tests/setup.js',
	globals: {
		__TEST_MODE__: 'REST',
		__APIURL__: 'http://127.0.0.1:3000/',
	},
};
