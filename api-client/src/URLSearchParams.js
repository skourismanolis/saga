module.exports =
	typeof process === 'undefined'
		? URLSearchParams
		: require('url').URLSearchParams;
