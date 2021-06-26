module.exports = {
	globals: {
		__APIURL__: 'readonly',
		__TEST_MODE__: 'readonly',
		__APIUNAME__: 'readonly',
		__APIPWD__: 'readonly',
	},
	plugins: ['prettier', 'jest'],
	env: {
		node: true,
		es6: true,
		'jest/globals': true,
	},
	extends: ['eslint:recommended', 'plugin:jest/recommended', 'prettier'],
	rules: {
		'prettier/prettier': 'error',
		'jest/no-conditional-expect': 'off',
	},
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
	},
};
