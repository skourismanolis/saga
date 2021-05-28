const Base = require('./Base');
const Label = require('./Label');
const Member = require('./Member');

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
			.filter((member) => member.admin === true);
	}

	async getNonAdmins() {
		let { data: members } = await this.axios.get(
			`/projects/${this._idProject}/members`
		);
		return members
			.map((member) => new Member(this.client, member))
			.filter((member) => member.admin === false);
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

	async update({ title, picture }) {
		await this.axios.put(`/projects/${this._idProject}`, {
			title,
			picture,
		});
	}
};
