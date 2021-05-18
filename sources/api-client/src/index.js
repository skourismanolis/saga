const axios = require('axios');

module.exports = class SagaClient {
	/**
	 * Saga client constructor
	 * @param {Object} options
	 * @param {String} options.url the baseurl of the api.
	 */
	constructor({ url }) {
		this.ax = axios.create({ baseURL: url });
	}
};
