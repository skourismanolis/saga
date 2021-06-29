module.exports = function (data) {
	if (typeof process !== 'undefined') {
		//we're running in Node.js
		let b = Buffer.from(data, 'base64');
		return b.toString('utf-8');
	} else {
		//eslint-disable-next-line no-undef
		return btoa(data);
	}
};
