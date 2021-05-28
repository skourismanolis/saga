const Base = require('./Base');
const Label = require('./Label');
const Issue = require('./Issue');
const Member = require('./Member');
const UserRole = require('./UserRoles');

module.exports = class Project extends Base {
	/**
	 * @param {SagaClient} client client this Project is attached to.
	 * @param {Number} idProject project id
	 */
	constructor(client, idProject) {
		super(client);
		this._idProject = idProject;
	}

	get id() {
		return this._idProject;
	}

	/**
	 * @returns {Object[]} array of Label's belonging to this project
	 */
	async getLabels() {
		let { data: labels } = await this.axios.get(
			`/projects/${this._idProject}/labels`
		);
		return labels.map((l) => new Label(this.client, l, this._idProject));
	}

	async getMembers() {
		let { data: members } = await this.axios.get(
			`/projects/${this._idProject}/members`
		);

		return members.map((member) => new Member(this.client, member));
	}

	async getAdmins() {
		let { data: members } = await this.axios.get(
			`/projects/${this._idProject}/members`
		);
		return members
			.map((member) => new Member(this.client, member))
			.filter((member) => member.role === UserRole.ADMIN);
	}

	async getNonAdmins() {
		let { data: members } = await this.axios.get(
			`/projects/${this._idProject}/members`
		);
		return members
			.map((member) => new Member(this.client, member))
			.filter((member) => member.role === UserRole.MEMBER);
	}

	/**
	 * @param {object} labelConf
	 * @param {string} labelConf.name the name of the label
	 * @param {string} labelConf.color the color of the label as a hex value including the starting #, ie: `#A525B6`
	 * @returns {object} the newly created Label object
	 */
	async createLabel({ name, color }) {
		let newLabel = { name, color };

		let {
			data: { idLabel },
		} = await this.axios.post(
			`/projects/${this._idProject}/labels`,
			newLabel
		);

		return new Label(
			this.client,
			{ idLabel, name, color },
			this._idProject
		);
	}

	/**
	 * @param {Object} label the label object to delete.
	 */
	async deleteLabel(label) {
		await this.axios.delete(
			`/projects/${this._idProject}/labels/${label.id}`
		);
	}

	/**
	 * completely deletes the given issue
	 * @param {Issue} issue the Issue to delete
	 */
	async deleteIssue(issue) {
		await this.axios.delete(
			`projects/${this._idProject}/issues/${issue.code}`
		);
	}

	/**
	 * Return Issue using the issue's code
	 * @param {String} code
	 */
	async getIssue(code) {
		let { data: issue } = this.axios.get(
			`/projects/${this._idProject}/issues/${code}`
		);
		return new Issue(this.client, issue);
	}

	/**
	 * Creates an issue on this project with the given values.
	 * @param {Object} issueConf the values used to create the issue
	 * @param {String} issueConf.title The title of the issue
	 * @param {String} issueConf.category One of 'Story', 'Task', 'Bug'
	 * @param {Number=} issueConf.points Story points
	 * @param {String=} issueConf.priority One of 'Very Low','Low','Neutral','High','Very High'
	 * @param {String=} issueConf.description Issue description
	 * @param {Date=} issueConf.deadline when is this issue due
	 * @param {Number=} issueConf.label id of the label thie new issue will have
	 * @returns {Issue}
	 */
	async createIssue({
		title,
		category,
		points,
		priority,
		description,
		deadline,
		label,
	}) {
		let newIssue = {
			title,
			category,
			idLabel: label || null,
			points: points || null,
			priority: priority || null,
			description: description || null,
			deadline: deadline || null,
		};

		let {
			data: { code },
		} = await this.axios.post(
			`/projects/${this._idProject}/issues`,
			newIssue
		);

		return await this.getIssue(code);
	}

	async update({ title, picture }) {
		await this.axios.put(`/projects/${this._idProject}`, {
			title,
			picture,
		});
	}
};
