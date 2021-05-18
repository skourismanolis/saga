module.exports = {
	plugins: ['prettier'],
	env: {
		node: true,
	},
	extends: ['eslint:recommended', 'prettier'],
	rules: {
		'prettier/prettier': 'error',
	},
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
	},
	overrides: [
		{
			plugins: ['jest'],
			files: ['**/__tests__/*.{j,t}s?(x)', '**/*.spec.{j,t}s?(x)'],
			extends: [
				'eslint:recommended',
				'plugin:jest/recommended',
				'prettier',
			],
			env: {
				'jest/globals': true,
			},
		},
	],
};
