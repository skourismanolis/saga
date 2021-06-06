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

	async refresh() {
		let { data } = await this.axios.get(
			`/projects/${this._idProject}/columns/${this.id}`
		);

		this.name = data.name;
		this.order = data.order;
	}

	async getProject() {
		let { data: projects } = await this.axios.get(`/projects`);

		let project = projects.find((m) => m.idProject == this._idProject);
		return new Project(this.client, project);
	}

	/**
	 * @param {object} columnConf
	 * @param {string=} columnConf.name the name of the column
	 * @param {Number=} columnConf.order the order of the column. Must be greater than 0.
	 */
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
		await this.refresh();
	}
};
const Project = require('./Project');
