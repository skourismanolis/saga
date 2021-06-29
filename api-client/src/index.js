const axios = require('axios');
const Project = require('./classes/Project');
const PaginatedList = require('./classes/PaginatedList');
const LOGINERROR = 'Please login first';

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

	/**
	 * Create a new user, the user must respond to the verification email in order to do be enabled
	 * @param {Object} userOpt
	 * @param {String} userOpt.username the user's username
	 * @param {String} userOpt.email the user's email
	 * @param {String} userOpt.password the user's password
	 * @param {String} userOpt.name the user's name
	 * @param {String} userOpt.surname the user's surname
	 * @param {String} userOpt.plan the user's payment plan, must be one of "Free", "Premium", "Host"
	 * @param {String} [userOpt.picture] the user's picture url
	 */
	async register({
		username,
		email,
		password,
		name,
		surname,
		plan,
		picture = null,
	}) {
		if (['Free', 'Premium', 'Host'].indexOf(plan) === -1)
			throw 'Error invalid plan value';

		await this.axios.post('/users', {
			username,
			email,
			password,
			name,
			surname,
			plan,
			picture,
		});
	}

	/**
	 * Edit a new user.
	 * @param {Object} userOpt
	 * @param {String} userOpt.username the user's username
	 * @param {String} userOpt.email the user's email
	 * @param {String} userOpt.password the user's password
	 * @param {String} userOpt.name the user's name
	 * @param {String} userOpt.surname the user's surname
	 * @param {String} userOpt.plan the user's payment plan, must be one of "Free", "Premium", "Host"
	 * @param {String} [userOpt.picture] the user's picture url
	 */
	async userEdit({
		username,
		email,
		password,
		name,
		surname,
		plan,
		picture = null,
	}) {
		if (!this._isLoggedIn) throw LOGINERROR;

		if (['Free', 'Premium', 'Host'].indexOf(plan) === -1)
			throw 'Error invalid plan value';

		await this.axios.put('/users', {
			username,
			email,
			password,
			name,
			surname,
			plan,
			picture,
		});
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
		if (!this._isLoggedIn) throw LOGINERROR;
		let list = new PaginatedList(this, {
			url: '/projects',
			dataTransformer: (projects) =>
				projects.map((proj) => new Project(this, proj)),
		});
		await list.refresh();
		return list;
	}

	async createProject({ title }) {
		if (!this._isLoggedIn) throw LOGINERROR;
		let { data } = await this.axios.post('/projects', { title });
		return new Project(this, {
			idProject: data.idProject,
			title,
			picture: null,
		});
	}
};
