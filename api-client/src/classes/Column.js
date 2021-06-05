const Base = require('./Base');
/****************************************************************************************/
/*                                       WARNING                                        */
/*    Move require's to the end of the file in order to avoid circular references       */
/*                                                                                      */
/****************************************************************************************/

module.exports = class Column extends Base {
	constructor(client, { idColumn, name, order }, idProject) {
		super(client);
		this._idColumn = idColumn;
		this.name = name;
		this.order = Number(order);
		this._idProject = idProject;
	}

	get id() {
		return this._idColumn;
	}

	toJSON() {
		return JSON.stringify({
			idColumn: this._idColumn,
			name: this.name,
			order: this.order,
		});
	}

	getProject() {
		return new Project(this.client, this._idProject);
	}

	async update({ name, order }) {
		if ((order != null && isNaN(order)) || order <= 0)
			throw 'Invalid order number';

		let newColumn = {
			name: name || this.name,
			order: order || this.order,
		};

		await this.axios.put(
			`/projects/${this._idProject}/columns/${this._idColumn}`,
			newColumn
		);
	}
};
const Project = require('./Project');
