const Base = require('./Base');
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

	async update({ title, picture }) {
		await this.axios.put(`/projects/${this._idProject}`, {
			title,
			picture,
		});
	}
};
