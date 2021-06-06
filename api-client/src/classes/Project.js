const Base = require('./Base');
const PaginatedList = require('./PaginatedList');
/****************************************************************************************/
/*                                       WARNING                                        */
/*    Move require's to the end of the file in order to avoid circular references       */
/*                                                                                      */
/****************************************************************************************/

module.exports = class Project extends Base {
	/**
	 * @param {SagaClient} client client this Project is attached to.
	 * @param {Number} idProject project id
	 */
	constructor(client, { idProject, title, picture }) {
		super(client);
		this._idProject = idProject;
		this.title = title;
		this.picture = picture || null;
	}

	get id() {
		return this._idProject;
	}

	toJSON() {
		return JSON.stringify({
			idProject: this._idProject,
			title: this.title,
			picture: this.picture,
		});
	}

	/**
	 * Get all the sprints belonging to the project
	 * @returns {Object[]} array of Sprints
	 */
	async getSprints() {
		let list = new PaginatedList(this.client, {
			url: `/projects/${this._idProject}/sprints`,
			dataTransformer: (sprints) =>
				sprints.map((s) => new Sprint(this.client, s, this._idProject)),
		});
		await list.refresh();
		return list;
	}

	/**
	 * @returns {Object[]} array of Label's belonging to this project
	 */
	async getLabels() {
		let { data: labels } = await this.axios.get(
			`/projects/${this._idProject}/labels`
		);
		return labels.map((l) => new Label(this.client, l, this._idProject));
	}

	/**
	 * @returns {Object[]} array of Columns belonging to this project
	 */
	async getColumns() {
		let { data: columns } = await this.axios.get(
			`/projects/${this._idProject}/columns`
		);

		return columns.map((c) => new Column(this.client, c, this._idProject));
	}

	/**
	 * Get a specific column from the api
	 * @param {Number} idColumn
	 * @returns {Object} Column
	 */
	async getColumn(idColumn) {
		let { data: column } = await this.axios.get(
			`/projects/${this._idProject}/columns/${idColumn}`
		);

		return new Column(this.client, column, this._idProject);
	}

	async getMembers() {
		let { data: members } = await this.axios.get(
			`/projects/${this._idProject}/members`
		);

		return members.map(
			(member) => new Member(this.client, member, this._idProject)
		);
	}

	async getAdmins() {
		let { data: members } = await this.axios.get(
			`/projects/${this._idProject}/members`
		);
		return members
			.map((member) => new Member(this.client, member, this._idProject))
			.filter((member) => member.role === UserRole.ADMIN);
	}

	async getNonAdmins() {
		let { data: members } = await this.axios.get(
			`/projects/${this._idProject}/members`
		);
		return members
			.map((member) => new Member(this.client, member, this._idProject))
			.filter((member) => member.role === UserRole.MEMBER);
	}

	/**
	 * Create a new sprint
	 * @param {Object} sprintConf sprint configuration
	 * @param {String} sprintConf.title the title of the sprint
	 * @param {Date|Null=} sprintConf.start When did this sprint start
	 * @param {Date|Null=} sprintConf.deadline when will this sprint end
	 */
	async createSprint({ start, deadline, title }) {
		let newSprint = {
			title: title,
			start: start || null,
			deadline: deadline || null,
		};

		let {
			data: { idSprint },
		} = await this.axios.post(
			`/projects/${this._idProject}/sprints`,
			newSprint
		);

		return new Sprint(
			this.client,
			{ ...newSprint, issues: [], idSprint },
			this._idProject
		);
	}

	/**
	 * @param {object} labelConf
	 * @param {string} labelConf.name the name of the label
	 * @param {string} labelConf.color the color of the label as a hex value including the starting #, ie: `#A525B6`
	 * @returns {object} the newly created Label object
	 */
	async createLabel({ name, color }) {
		let newLabel = { name, color };

		let {
			data: { idLabel },
		} = await this.axios.post(
			`/projects/${this._idProject}/labels`,
			newLabel
		);

		return new Label(
			this.client,
			{ idLabel, name, color },
			this._idProject
		);
	}

	/**
	 * @param {object} columnConf
	 * @param {string} columnConf.name the name of the column
	 * @param {Number} columnConf.order the order of the column. Must be greater than 0.
	 * @returns {object} the newly created column
	 */
	async createColumn({ name, order }) {
		let newColumn = { name, order };
		let {
			data: { idColumn },
		} = await this.axios.post(
			`/projects/${this._idProject}/columns`,
			newColumn
		);

		return new Column(
			this.client,
			{ idColumn, name, order },
			this._idProject
		);
	}

	/**
	 * deletes the given sprint.
	 * @param {Object} sprint the sprint to delete
	 */
	async deleteSprint(sprint) {
		await this.axios.delete(
			`/projects/${this._idProject}/sprints/${sprint.id}`
		);
	}

	/**
	 * @param {Object} label the label object to delete.
	 */
	async deleteLabel(label) {
		await this.axios.delete(
			`/projects/${this._idProject}/labels/${label.id}`
		);
	}

	/**
	 * completely deletes the given issue
	 * @param {Issue} issue the Issue to delete
	 */
	async deleteIssue(issue) {
		await this.axios.delete(
			`projects/${this._idProject}/issues/${issue.code}`
		);
	}

	/**
	 * remove a column from the project.
	 * @param {object} column Column object
	 */
	async deleteColumn(column) {
		await this.axios.delete(
			`projects/${this._idProject}/columns/${column.id}`
		);
	}

	/**
	 * Return Issue using the issue's code
	 * @param {String} code
	 */
	async getIssue(code) {
		let { data: issue } = await this.axios.get(
			`/projects/${this._idProject}/issues/${code}`
		);
		return new Issue(this.client, issue, this._idProject);
	}

	/**
	 * Creates an issue on this project with the given values.
	 * @param {Object} issueConf the values used to create the issue
	 * @param {String} issueConf.title The title of the issue
	 * @param {String} issueConf.category One of 'Story', 'Task', 'Bug'
	 * @param {Number=} issueConf.points Story points
	 * @param {String=} issueConf.priority One of 'Very Low','Low','Neutral','High','Very High'
	 * @param {String=} issueConf.description Issue description
	 * @param {Date=} issueConf.deadline when is this issue due
	 * @param {Number|Null=} issueConf.label the label the new issue will have
	 * @returns {Issue}
	 */
	async createIssue({
		title,
		category,
		points,
		priority,
		description,
		deadline,
		label,
	}) {
		let labelValue;

		if (label == undefined) labelValue = null;
		else labelValue = label.id;

		let newIssue = {
			title,
			category,
			idLabel: labelValue,
			points: points || null,
			priority: priority || null,
			description: description || null,
			deadline: deadline || null,
			assignees: [],
		};

		let {
			data: { code },
		} = await this.axios.post(
			`/projects/${this._idProject}/issues`,
			newIssue
		);

		return await this.getIssue(code);
	}

	async refresh() {
		let { data: projects } = await this.axios.get(`/projects`);

		let project = projects.find((m) => m.idProject == this._idProject);
		this.title = project.title;
		this.picture = project.picture;
	}

	async update({ title, picture }) {
		await this.axios.put(`/projects/${this._idProject}`, {
			title,
			picture,
		});

		await this.refresh();
	}
};

const Issue = require('./Issue');
const Label = require('./Label');
const Member = require('./Member');
const Sprint = require('./Sprint');
const UserRole = require('./UserRoles');
const Column = require('./Column');
