module.exports = class Base {
	constructor(client) {
		this.client = client;
		this.axios = client.axios;
	}

	get id() {
		throw 'This must be overriden';
	}
};
