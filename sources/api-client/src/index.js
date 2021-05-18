const axios = require('axios');
const Project = require('./classes/project');

module.exports = class SagaClient {
	/**
	 * Saga client constructor
	 * @param {Object} options
	 * @param {String} options.url the baseurl of the api.
	 */
	constructor({ url }) {
		this.axios = axios.create({ baseURL: url });
	}

	async getProjects() {
		let { data: projects } = await this.axios.get('/projects');
		return projects.map((proj) => new Project(this, proj));
	}
};
