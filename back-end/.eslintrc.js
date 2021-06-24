module.exports = {
	plugins: ['prettier'],
	env: {
		node: true,
		jest: true,
		es6: true,
	},
	extends: ['eslint:recommended', 'prettier'],
	rules: {
		'prettier/prettier': 'error',
	},
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
	},
	// overrides: [
	// 	{
	// 		files: [
	// 			'**/__tests__/*.{j,t}s?(x)',
	// 			'**/tests/unit/**/*.spec.{j,t}s?(x)',
	// 		],
	// 		env: {
	// 			jest: true,
	// 		},
	// 	},
	// ],
};
