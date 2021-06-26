const jestGlobals = require('./jest.config.js').globals;

let globals = {};
Object.keys(jestGlobals).forEach((global) => (globals[global] = 'readonly'));

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
