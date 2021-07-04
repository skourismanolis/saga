const URLSearchParams = require('url').URLSearchParams;
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
	constructor(client, { idProject, title, picture, activeSprint, members }) {
		super(client);
		this._idProject = idProject;
		this.title = title;
		this._activeSprintId = activeSprint;
		this.picture = picture;
		this._members = members;
	}

	get id() {
		return this._idProject;
	}

	toJSON() {
		return JSON.stringify(
			{
				idProject: this._idProject,
				title: this.title,
				picture: this.picture,
				members: this._members,
				activeSprint: this._activeSprintId,
			},
			null,
			4
		);
	}

	/**
	 * Returns the active sprint or null if there isn't any;
	 * @returns {Object|Null} the current active sprint
	 */
	async getActiveSprint() {
		if (this._activeSprintId == null) return null;
		let { data } = await this.axios.get(
			`/projects/${this._idProject}/sprints/${this._activeSprintId}`
		);
		return new Sprint(this.client, data, this._idProject);
	}

	async setActiveSprint(sprint) {
		if (sprint !== null && sprint.id == null) throw 'Invalid sprint';
		await this.axios.put(`/projects/${this._idProject}/active`, {
			id: sprint === null ? null : sprint.id,
		});
		await this.refresh();
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
	 * Get all the epics belonging to the project
	 * @returns {Object[]} array of Epics
	 */
	async getEpics() {
		let list = new PaginatedList(this.client, {
			url: `/projects/${this._idProject}/epics`,
			dataTransformer: (epics) =>
				epics.map((e) => new Epic(this.client, e, this._idProject)),
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
	 * Search all the issues of this project. Search terms are applied using AND.
	 * @param {Object} config
	 * @param {Object=} config.inSprint include only issues belonging to the given sprint
	 * @param {Object=} config.inEpic include only issues belonging to the given epic
	 * @param {Object[]=} config.labels include only issues with one of the given labels
	 * @param {Object=} config.assignee include issues assigned to the given user
	 * @param {Object|Null=} config.column include only issues on the given column. Null means the to-do column
	 * @param {Object=} config.search full-text search string on the issues
	 * @returns {Object} PaginatedList of Issues
	 */
	async searchIssues({ inSprint, labels, assignee, column, inEpic, search }) {
		let query = {};
		if (inSprint !== undefined) {
			query.inSprint = inSprint === null ? null : inSprint.id;
		}

		if (labels != null) {
			if (!(labels instanceof Array)) throw 'Labels must be an array';
			query.labels = labels.map((l) => l.id);
		}

		if (assignee != null) {
			query.assignee = assignee.id;
		}

		if (column !== undefined) {
			query.column = column === null ? null : column.id;
		}

		if (inEpic !== undefined) {
			query.inEpic = inEpic === null ? null : inEpic.id;
		}

		if (search != null) {
			query.search = search;
		}

		let queryParams = new URLSearchParams(query);
		let url =
			`/projects/${this._idProject}/issues?` + queryParams.toString();

		let ret = new PaginatedList(this.client, {
			url,
			dataTransformer: (issues) =>
				issues.map((i) => new Issue(this.client, i, this._idProject)),
		});

		await ret.refresh();
		return ret;
	}

	/**
	 * Create a new epic
	 * @param {Object} epicConf epic configuration
	 * @param {String} epicConf.title the title of the epic
	 * @param {Date|Null=} epicConf.start When did this epic start
	 * @param {Date|Null=} epicConf.deadline when will this epic end
	 * @param {Date|Null=} epicConf.description the description of the epic
	 */
	async createEpic({ start, deadline, title, description }) {
		let newEpic = {
			title: title,
			start: start || null,
			deadline: deadline || null,
			description: description || null,
		};

		let {
			data: { idEpic },
		} = await this.axios.post(
			`/projects/${this._idProject}/epics`,
			newEpic
		);

		return new Epic(
			this.client,
			{ ...newEpic, issues: [], idEpic },
			this._idProject
		);
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
	 * deletes the given epic.
	 * @param {Object} epic the epic to delete
	 */
	async deleteEpic(epic) {
		await this.axios.delete(
			`/projects/${this._idProject}/epics/${epic.id}`
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
		assignees,
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
			assignees: assignees || null,
		};

		let {
			data: { code },
		} = await this.axios.post(
			`/projects/${this._idProject}/issues`,
			newIssue
		);

		return await this.getIssue(code);
	}

	/**
	 * Changes the project's picture
	 * !!WARNING: ONLY WORKS ON BROWSER ENVIRONMENTS
	 * @param {Object} options
	 * @param {File} options.picture
	 */
	async setPicture({ picture }) {
		//eslint-disable-next-line no-undef
		if (FormData === 'undefined')
			throw 'Invalid environment, this only works on browser';
		//eslint-disable-next-line no-undef
		if (!(picture instanceof File)) throw 'Picture must be a File';

		//eslint-disable-next-line no-undef
		let data = new FormData();

		data.append('picture', picture, picture.name);

		await this.axios({
			method: 'PUT',
			url: `/projects/${this._idProject}/picture`,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			data,
		});
	}

	async refresh() {
		let { data: projects } = await this.axios.get(`/projects`);

		let project = projects.find((m) => m.idProject == this._idProject);
		this.title = project.title;
		this.picture = project.picture;
		this._activeSprintId = project.activeSprint;
	}

	async update({ title }) {
		await this.axios.put(`/projects/${this._idProject}`, {
			title,
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
const Epic = require('./Epic');
