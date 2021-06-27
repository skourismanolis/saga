const IssueContainer = require('./IssueContainer');

/****************************************************************************************/
/*                                       WARNING                                        */
/*    Move require's to the end of the file in order to avoid circular references       */
/*                                                                                      */
/****************************************************************************************/

module.exports = class Epic extends IssueContainer {
	constructor(
		client,
		{ idEpic, start, deadline, title, description },
		idProject
	) {
		super(
			client,
			{
				start,
				deadline,
				title,
			},
			idProject,
			`/projects/${idProject}/epics/${idEpic}`
		);
		this._idEpic = idEpic;
		this.description = description;
	}

	get id() {
		return this._idEpic;
	}

	toJSON() {
		return JSON.stringify({
			idEpic: this._idEpic,
			idProject: this._idProject,
			start: this.start,
			deadline: this.deadline,
			title: this.title,
			description: this.description,
		});
	}

	async refresh() {
		let { data } = await this.axios.get(
			`/projects/${this._idProject}/epics/${this._idEpic}`
		);

		this.start = data.start != null ? new Date(data.start) : null;
		this.deadline = data.deadline != null ? new Date(data.deadline) : null;
		this.description = data.description;
	}

	/**
	 * Update the epic's values
	 * @param {Object} epicConf epic configuration
	 * @param {String=} epicConf.title the title of the epic
	 * @param {Date|Null=} epicConf.start When did this epic start
	 * @param {Date|Null=} epicConf.finish when will this epic end
	 */
	async update({ title, description, start, deadline }) {
		let newEpic = {
			title: title || this.title,
			start: start !== undefined ? start : this.start,
			deadline: deadline !== undefined ? deadline : this.deadline,
			description:
				description !== undefined ? description : this.description,
		};

		await this.axios.put(
			`/projects/${this._idProject}/epics/${this._idEpic}`,
			newEpic
		);
		await this.refresh();
	}
};
