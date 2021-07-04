const axios = require('axios');
const Project = require('./classes/Project');
const PaginatedList = require('./classes/PaginatedList');
const decode64 = require('./parseB64');
const Issue = require('./classes/Issue');

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
		this._user = null;
		this._token = null;
	}

	get isLoggedIn() {
		return this._token != null;
	}

	get user() {
		return this._user;
	}

	get token() {
		return this._token;
	}

	async getProfile() {
		if (!this.isLoggedIn) throw LOGINERROR;
		let { data } = await this.axios.get(`/users/${this._user.idUser}`);
		return data;
	}

	/**
	 * Handles the given token
	 * @param {Object} handleTokenOpts
	 * @param {String} handleTokenOpts.token the token to process
	 */
	async handleToken({ token }) {
		if (!this.isLoggedIn) throw LOGINERROR;
		await this.axios.get(`/token/${token}`);
	}

	async getPayments() {
		if (!this.isLoggedIn) throw LOGINERROR;
		let { data } = await this.axios.get(
			`/users/${this._user.idUser}/payment`
		);
		return data;
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
	async register({ username, email, password, name, surname, plan }) {
		if (['Free', 'Premium', 'Host'].indexOf(plan) === -1)
			throw 'Error invalid plan value';

		await this.axios.post('/users', {
			username,
			email,
			password,
			name,
			surname,
			plan,
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
	 */
	async userEdit({ username, email, password, name, surname, plan }) {
		if (!this.isLoggedIn) throw LOGINERROR;

		if (['Free', 'Premium', 'Host'].indexOf(plan) === -1)
			throw 'Error invalid plan value';

		await this.axios.put('/users', {
			username,
			email,
			password,
			name,
			surname,
			plan,
		});
	}

	/**
	 * Changes the current user's picture
	 * !!WARNING: ONLY WORKS ON BROWSER ENVIRONMENTS
	 * @param {Object} options
	 * @param {File} options.picture
	 */
	async setUserPicture({ picture }) {
		if (!this.isLoggedIn) throw LOGINERROR;
		//eslint-disable-next-line no-undef
		if (FormData === 'undefined')
			throw 'Invalid environment, this only works on browser';
		//eslint-disable-next-line no-undef
		if (!(picture instanceof File)) throw 'Picture must be a File';

		//eslint-disable-next-line no-undef
		let data = new FormData();

		data.append('picture', picture, picture.name);

		await this.axios({
			method: 'PUT',
			url: '/users/picture',
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			data,
		});
	}

	/**
	 * Delete current user. Comments and issues by this user will have theis creator id set to 0.
	 * @param {Object} deletUsrOpt
	 * @param {Object} deletUsrOpt.password the current user's passowrd
	 */
	async deleteUser({ password }) {
		if (!this.isLoggedIn) throw LOGINERROR;
		await this.axios({
			method: 'DELETE',
			url: '/users',
			data: { password },
		});
		this.logout();
	}

	setToken(token) {
		this._token = token;
		let jsonStr = decode64(token.split('.')[1]);
		this._user = JSON.parse(jsonStr);
		this.axios.defaults.headers.Authorization = 'Bearer ' + this._token;
	}

	logout() {
		this._token = null;
		this._user = null;
		this.axios.defaults.headers.Authorization = null;
	}

	async login({ email, password }) {
		let { data } = await this.axios.post('/users/login', {
			email,
			password,
		});
		this.setToken(data.token);
	}

	async getProjects() {
		if (!this.isLoggedIn) throw LOGINERROR;
		let list = new PaginatedList(this, {
			url: '/projects',
			dataTransformer: (projects) =>
				projects.map((proj) => new Project(this, proj)),
		});
		await list.refresh();
		return list;
	}

	async getProject({ idProject }) {
		if (!this.isLoggedIn) throw LOGINERROR;
		let { data } = await this.axios.get('/projects/' + idProject);
		return new Project(this, {
			idProject,
			title: data.title,
			activeSprint: data.activeSprint,
			picture: data.picture,
			members: data.members,
		});
	}

	async getProjectIssue({ idProject, code }) {
		if (!this.isLoggedIn) throw LOGINERROR;
		let { data } = await this.axios.get(
			'/projects/' + idProject + '/issues/' + code
		);
		return new Issue(this, data, idProject);
	}

	async createProject({ title }) {
		if (!this.isLoggedIn) throw LOGINERROR;
		let { data } = await this.axios.post('/projects', { title });
		return new Project(this, {
			idProject: data.idProject,
			title,
			picture: null,
		});
	}
};
