const Base = require('./Base');
/****************************************************************************************/
/*                                       WARNING                                        */
/*    Move require's to the end of the file in order to avoid circular references       */
/*                                                                                      */
/****************************************************************************************/

module.exports = class Member extends Base {
	/**
	 * Represents the member of a project. Read Only
	 * @param {SagaClient} client
	 * @param {Object} member
	 */
	constructor(
		client,
		{ idUser, name, surname, email, role, picture },
		idProject
	) {
		super(client);
		this._idProject = idProject;
		this._idUser = idUser;
		this.name = name;
		this.surname = surname;
		this.email = email || null;
		this.role = role;
		this.picture = picture || null;
	}

	get id() {
		return this._idUser;
	}

	toJSON() {
		return JSON.stringify({
			idUser: this._idUser,
			name: this.name,
			surname: this.surname,
			email: this.email,
			role: this.role,
			picture: this.picture,
		});
	}

	async getProject() {
		let { data: projects } = await this.axios.get(`/projects`);

		let project = projects.find((m) => m.idProject == this._idProject);
		return new Project(this.client, project);
	}

	async refresh() {
		let { data: members } = await this.axios.get(
			`/projects/${this._idProject}/members`
		);

		let member = members.find((m) => m.idUser == this._idUser);

		this.name = member.name;
		this.surname = member.surname;
		this.email = member.email || null;
		this.role = member.role;
		this.picture = member.picture || null;
	}
};
const Project = require('./Project');
