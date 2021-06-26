const clientJestGlobals = require('./client.jest.config').globals;
const restJestGlobals = require('./rest.jest.config').globals;

// inform eslint of the global variables set in the jest configs
let globals = {};
Object.keys(clientJestGlobals).forEach(
	(global) => (globals[global] = 'readonly')
);
Object.keys(restJestGlobals).forEach(
	(global) => (globals[global] = 'readonly')
);

module.exports = {
	globals,
	plugins: ['prettier', 'jest'],
	env: {
		node: true,
		es6: true,
		'jest/globals': true,
	},
	extends: ['eslint:recommended', 'plugin:jest/recommended', 'prettier'],
	rules: {
		'prettier/prettier': 'error',
	},
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
	},
};
