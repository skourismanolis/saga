const axios = require('axios');
const Project = require('./classes/Project');

module.exports = class SagaClient {
	/**
	 * Saga client constructor
	 * @param {Object} options
	 * @param {String} options.url the baseurl of the api.
	 * @param {Number=15} options.perPage how many items each page has
	 */
	constructor({ url, perPage = 15 }) {
		if (perPage <= 0) throw 'Invalid page size. Must be greater than 0.';
		this.axios = axios.create({ baseURL: url });
		this._perPage = perPage;
	}

	async getProjects() {
		let { data: projects } = await this.axios.get('/projects');

		return projects.map((proj) => new Project(this, proj.id));
	}
};
