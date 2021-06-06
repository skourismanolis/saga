module.exports = class Base {
	constructor(client) {
		this.client = client;
		this.axios = client.axios;
	}

	get id() {
		throw 'This must be overriden';
	}

	toJSON() {
		throw 'This must be overriden';
	}

	async refresh() {
		throw 'This must be overriden';
	}
};
