const axios = require('axios');
const Project = require('./classes/Project');
const PaginatedList = require('./classes/PaginatedList');

module.exports = class SagaClient {
	/**
	 * Saga client constructor
	 * @param {Object} options
	 * @param {String} options.url the baseurl of the api.
	 * @param {Number} [options.perPage=15] how many items each page has
	 */
	constructor({ url, perPage = 15 }) {
		if (perPage <= 0) throw 'Invalid page size. Must be greater than 0.';
		this.axios = axios.create({ baseURL: url });
		this._perPage = perPage;
		this._isLoggedIn = false;
	}

	async login({ email, password }) {
		let { data } = await this.axios.post('/users/login', {
			email,
			password,
		});
		this.axios.defaults.headers.Authorization = 'Bearer ' + data.token;
		this._isLoggedIn = true;
	}

	async getProjects() {
		if (!this._isLoggedIn) throw 'Please login first';
		let list = new PaginatedList(this, {
			url: '/projects',
			dataTransformer: (projects) =>
				projects.map((proj) => new Project(this, proj)),
		});
		await list.refresh();
		return list;
	}

	async createProject({ title }) {
		let { data } = await this.axios.post('/projects', { title });
		return new Project(this, {
			idProject: data.idProject,
			title,
			picture: null,
		});
	}
};
