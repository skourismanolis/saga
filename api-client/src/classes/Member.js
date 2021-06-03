const Base = require('./Base');

module.exports = class Member extends Base {
	/**
	 * Represents the member of a project. Read Only
	 * @param {SagaClient} client
	 * @param {Object} member
	 */
	constructor(client, { idMember, name, surname, email, role, picture }) {
		super(client);
		this._idMember = idMember;
		this.name = name;
		this.surname = surname;
		this.email = email || null;
		this.role = role;
		this.picture = picture || null;
	}

	get id() {
		return this._idMember;
	}

	toJSON() {
		return JSON.stringify({
			idMember: this._idMember,
			name: this.name,
			surname: this.surname,
			email: this.email,
			role: this.role,
			picture: this.picture,
		});
	}
};
