const Base = require('./Base');

module.exports = class Project extends Base {
	/**
	 * @param {Object} project project short JSON
	 * @param {Number} project.idProject project id
	 * @param {String} project.name project name
	 * @param {Object[]} project.members array of project members
	 * @param {String} project.members.name name of project member
	 * @param {String} project.members.surname surname of project member
	 * @param {Boolean} project.members.admin is this user a project admin?
	 * @param {String?} project.members.picture url of the user's avatar
	 */
	constructor(client, { idProject, name, members }) {
		super(client);
		this._idProject = idProject;
		this.name = name;
		this.members = members;
	}

	get id() {
		return this._idProject;
	}

	get admins() {
		return this.members.filter((member) => member.admin === true);
	}

	get nonAdmins() {
		return this.members.filter((member) => member.admin === false);
	}
};
