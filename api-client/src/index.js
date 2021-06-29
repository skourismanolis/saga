const axios = require('axios');
const Project = require('./classes/Project');
const PaginatedList = require('./classes/PaginatedList');
const decode64 = require('./parseB64');

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
		this._user = null;
	}

	get isLoggedIn() {
		return this._isLoggedIn;
	}

	get user() {
		return this._user;
	}

	/**
	 * Handles the given token
	 * @param {Object} handleTokenOpts
	 * @param {String} handleTokenOpts.token the token to process
	 */
	async handleToken({ token }) {
		if (!this._isLoggedIn) throw LOGINERROR;
		await this.axios.get(`/token/${token}`);
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
	 * @param {String|Null=} userOpt.picture the user's picture url
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

	/**
	 * Delete current user. Comments and issues by this user will have theis creator id set to 0.
	 * @param {Object} deletUsrOpt
	 * @param {Object} deletUsrOpt.password the current user's passowrd
	 */
	async deleteUser({ password }) {
		if (!this._isLoggedIn) throw LOGINERROR;
		await this.axios.delete('/users', { password });
		this.logout();
	}

	logout() {
		this._isLoggedIn = false;
		this._user = null;
		this.axios.defaults.headers.Authorization = '';
	}

	async login({ email, password }) {
		let { data } = await this.axios.post('/users/login', {
			email,
			password,
		});
		this.axios.defaults.headers.Authorization = 'Bearer ' + data.token;
		this._isLoggedIn = true;
		let jsonStr = decode64(data.token.split('.')[1]);
		this._user = JSON.parse(jsonStr);
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
