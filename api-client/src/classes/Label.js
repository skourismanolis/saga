const Base = require('./Base');
const Project = require('./Project');

module.exports = class Label extends Base {
	constructor(client, { idLabel, name, color }, idProject) {
		super(client);
		this._idProject = idProject;
		this._idLabel = idLabel;
		this.name = name;
		this.color = color;
	}

	get id() {
		return this._idLabel;
	}

	toJSON() {
		return JSON.stringify({
			idProject: this._idProject,
			idLabel: this._idLabel,
			name: this.name,
			color: this.color,
		});
	}

	async refresh() {
		let { data } = await this.axios.get(
			`/projects/${this._idProject}/labels/${this.id}`
		);

		this.name = data.name;
		this.color = data.color;
	}

	getProject() {
		return new Project(this.client, this._idProject);
	}

	/**
	 * @param {object} labelConf
	 * @param {string} labelConf.name the name of the label
	 * @param {string} labelConf.color the color of the label as a hex value including the starting #, ie: `#A525B6`
	 */
	async update({ name, color }) {
		let newLabel = {
			name: name || this.name,
			color: color || this.color,
		};

		await this.axios.put(
			`/projects/${this._idProject}/labels/${this._idLabel}`,
			newLabel
		);
		await this.refresh();
	}
};
