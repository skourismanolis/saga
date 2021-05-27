module.exports = class Base {
	constructor(client) {
		this.client = client;
		this.axios = client.axios;
	}
};
