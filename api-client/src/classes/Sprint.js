const IssueContainer = require('./IssueContainer');

/****************************************************************************************/
/*                                       WARNING                                        */
/*    Move require's to the end of the file in order to avoid circular references       */
/*                                                                                      */
/****************************************************************************************/

module.exports = class Sprint extends IssueContainer {
	constructor(client, { idSprint, start, deadline, title }, idProject) {
		super(
			client,
			{
				start: start === undefined ? null : start,
				deadline,
				title,
			},
			idProject,
			`/projects/${idProject}/sprints/${idSprint}`
		);
		this._idSprint = idSprint;
	}

	get id() {
		return this._idSprint;
	}

	toJSON() {
		return JSON.stringify({
			idSprint: this._idSprint,
			idProject: this._idProject,
			start: this.start,
			deadline: this.deadline,
			title: this.title,
		});
	}

	async refresh() {
		let { data } = await this.axios.get(
			`/projects/${this._idProject}/sprints/${this._idSprint}`
		);

		this.start = data.start != null ? new Date(data.start) : null;
		this.deadline = data.deadline != null ? new Date(data.deadline) : null;
	}

	/**
	 * Update the sprint's values
	 * @param {Object} sprintConf sprint configuration
	 * @param {String=} sprintConf.title the title of the sprint
	 * @param {Date|Null=} sprintConf.start When did this sprint start
	 * @param {Date|Null=} sprintConf.finish when will this sprint end
	 */
	async update({ title, start, deadline }) {
		let newSprint = {
			title: title || this.title,
			start: start !== undefined ? start : this.start,
			deadline: deadline !== undefined ? deadline : this.deadline,
		};

		await this.axios.put(
			`/projects/${this._idProject}/sprints/${this._idSprint}`,
			newSprint
		);

		await this.refresh();
	}
};
