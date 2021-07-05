const Base = require('./Base');
const PaginatedList = require('./PaginatedList');
const dayjs = require('dayjs');

/****************************************************************************************/
/*                                       WARNING                                        */
/*    Move require's to the end of the file in order to avoid circular references       */
/*                                                                                      */
/****************************************************************************************/

module.exports = class IssueContainer extends Base {
	/**
	 * @param {Object} client the SagaClient object
	 * @param {Object} config
	 * @param {Number} idProject the project this IssueContainer belongs to
	 * @param {String} itemUrl the baseurl this IssueContainer has, i.e `/projects/2/sprints/3/`
	 */
	constructor(client, { start, deadline, title }, idProject, itemUrl) {
		super(client);
		this.start = start != null ? new Date(start) : null;
		this.deadline = deadline != null ? new Date(deadline) : null;
		this.title = title;
		this._idProject = idProject;
		this._itemUrl = itemUrl;
	}

	/**
	 * Get the project this sprint belongs in
	 * @returns {object} Project
	 */
	async getProject() {
		let { data: projects } = await this.axios.get(`/projects`);

		let project = projects.find((m) => m.idProject == this._idProject);
		return new Project(this.client, project);
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
		if (this.deadline === null) return null;
		return dayjs(this.deadline).diff(dayjs());
	}

	/**
	 * returns all the included issues.
	 * @returns {Object} Issue PaginatedList
	 */
	async getIssues() {
		let list = new PaginatedList(this.client, {
			url: `${this._itemUrl}/issues`,
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
		await this.axios.post(`${this._itemUrl}/issues`, issueIds);
	}

	/**
	 * Remove the given issues from the sprint
	 * @param {Object[]} issues the Issues to remove
	 */
	async removeIssues(issues) {
		let issueIds = issues.map((i) => i.id);
		await this.axios({
			method: 'DELETE',
			url: `${this._itemUrl}/issues`,
			data: issueIds,
		});
	}
};

const Project = require('./Project');
const Issue = require('./Issue');
