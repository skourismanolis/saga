const Base = require('./Base');
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
		this.start = start;
		this.finish = finish;
		this.title = title;
		this._issueIds = issues;
		this._idProject = idProject;
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
	 * @returns {Number|null}
	 */
	dueIn() {
		if (this.finish === null) return null;
		return dayjs().diff(this.finish);
	}

	/**
	 * returns all the Issues belonging to this sprint.
	 * @returns {Object[]} Issue array.
	 */
	async getAllIssues() {
		const issueUrl = `/projects/${this._idProject}/issues/`;
		let reponses = await Promise.all(
			this._issueIds.map((code) => this.axios.get(issueUrl + code))
		);

		return reponses.map(
			({ data: issue }) => new Issue(this.client, issue, this._idProject)
		);
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
