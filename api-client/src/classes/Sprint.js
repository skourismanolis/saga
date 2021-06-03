const Base = require('./Base');
const PaginatedList = require('./PaginatedList');
const dayjs = require('dayjs');

/****************************************************************************************/
/*                                       WARNING                                        */
/*    Move require's to the end of the file in order to avoid circular references       */
/*                                                                                      */
/****************************************************************************************/

module.exports = class Sprint extends Base {
	constructor(client, { idSprint, start, finish, title, issues }, idProject) {
		super(client);
		this._idSprint = idSprint;
		this.start = start != null ? new Date(start) : null;
		this.finish = finish != null ? new Date(finish) : null;
		this.title = title;
		this._issueIds = issues;
		this._idProject = idProject;
	}

	get id() {
		return this._idSprint;
	}

	toJSON() {
		return JSON.stringify({
			idSprint: this._idSprint,
			issueIds: this._issues,
			idProject: this._idProject,
			start: this.start,
			finish: this.finish,
			title: this.title,
		});
	}

	/**
	 * Get the project this sprint belongs in
	 * @returns {object} Project
	 */
	getProject() {
		return new Project(this.client, this._idProject);
	}

	/**
	 * Checks if the given issue belongs to the given sprint
	 * @param {Object} issue Issue to check if it belongs to this Sprint
	 * @returns {Boolean}
	 */
	inSprint(issue) {
		return this._issueIds.indexOf(issue.id) !== -1;
	}

	/**
	 * Whether this sprint's start date has passed or not.
	 * If no start date is set it means that the sprint hasn't started
	 * @returns {Boolean}
	 */
	started() {
		return this.start !== null;
	}

	/**
	 * The time (in milliseconds) left until the deadline. Can be negative.
	 * If there's no deadline set, it returns null.
	 * @returns {Number|null} milliseconds until the deadline.
	 */
	dueIn() {
		if (this.finish === null) return null;
		return dayjs(this.finish).diff(dayjs());
	}

	/**
	 * returns all the Issues belonging to this sprint.
	 * @returns {Object} Issue PaginatedList
	 */
	async getIssues() {
		let list = new PaginatedList(this.client, {
			url: `/projects/${this._idProject}/sprints/${this._idSprint}/issues`,
			dataTransformer: (issues) =>
				issues.map(
					(issue) => new Issue(this.client, issue, this._idProject)
				),
		});

		await list.refresh();
		return list;
	}

	/**
	 * Adds the given issues to the sprint
	 * @param {Object[]} issues the Issues to add
	 */
	async addIssues(issues) {
		let issueIds = issues.map((i) => i.id);
		await this.axios.post(
			`/projects/${this._idProject}/sprints/${this._idSprint}/issues`,
			issueIds
		);
	}

	/**
	 * Remove the given issues from the sprint
	 * @param {Object[]} issues the Issues to remove
	 */
	async removeIssues(issues) {
		let issueIds = issues.map((i) => i.id);
		await this.axios.delete(
			`/projects/${this._idProject}/sprints/${this._idSprint}/issues`,
			issueIds
		);
	}

	/**
	 * Update the sprint's values
	 * @param {Object} sprintConf sprint configuration
	 * @param {String=} sprintConf.title the title of the sprint
	 * @param {Date|Null=} sprintConf.start When did this sprint start
	 * @param {Date|Null=} sprintConf.finish when will this sprint end
	 */
	async update({ title, start, finish }) {
		let newSprint = {
			title: title || this.title,
			start: start !== undefined ? start : this.start,
			finish: finish !== undefined ? finish : this.finish,
		};

		await this.axios.put(
			`/projects/${this._idProject}/sprints/${this._idSprint}`,
			newSprint
		);
	}
};

const Project = require('./Project');
const Issue = require('./Issue');
