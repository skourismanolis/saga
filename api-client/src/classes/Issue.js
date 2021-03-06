const Base = require('./Base');
const PaginatedList = require('./PaginatedList');
/****************************************************************************************/
/*                                       WARNING                                        */
/*    Move require's to the end of the file in order to avoid circular references       */
/*                                                                                      */
/****************************************************************************************/

module.exports = class Issue extends Base {
	constructor(
		client,
		{
			idSprint,
			idColumn,
			idEpic,
			idLabel,
			assignees,
			code,
			title,
			category,
			points,
			priority,
			description,
			deadline,
		},
		idProject
	) {
		super(client);
		this._idProject = idProject;
		this._idSprint = idSprint;
		this._idColumn = idColumn;
		this._idEpic = idEpic;
		this._idLabel = idLabel;
		this._assigneeIds = assignees;
		this._code = code;
		this.title = title;
		this.category = category;
		this.points = points;
		this.priority = priority;
		this.description = description;
		this.deadline = deadline != null ? new Date(deadline) : null;
	}

	toJSON() {
		return JSON.stringify(
			{
				idProject: this._idProject,
				idSprint: this._idSprint,
				idColumn: this._idColumn,
				idEpic: this._idEpic,
				idLabel: this._idLabel,
				assignees: this._assigneeIds,
				code: this._code,
				title: this.title,
				category: this.category,
				points: this.points,
				priority: this.priority,
				description: this.description,
				deadline:
					this.deadline instanceof Date
						? this.deadline.toISOString()
						: null,
			},
			null,
			4
		);
	}

	async refresh() {
		let { data } = await this.axios.get(
			`/projects/${this._idProject}/issues/${this.id}`
		);

		this._idSprint = data.idSprint;
		this._idColumn = data.idColumn;
		this._idEpic = data.idEpic;
		this._idLabel = data.idLabel;
		this._assigneeIds = data.assignees;
		this.title = data.title;
		this.category = data.category;
		this.points = data.points;
		this.priority = data.priority;
		this.description = data.description;
		this.deadline = data.deadline != null ? new Date(data.deadline) : null;
	}

	get id() {
		return this._code;
	}

	get code() {
		return this._code;
	}

	async getProject() {
		let { data: projects } = await this.axios.get(`/projects`);

		let project = projects.find((m) => m.idProject == this._idProject);
		return new Project(this.client, project);
	}

	/**
	 * Get the Sprint this Issue belongs in. If it doesn't belong to a sprint, returns null
	 * @returns {Object|Null} the Sprint
	 */
	async getSprint() {
		if (this._idSprint == null) return null;
		else {
			let { data: sprint } = await this.axios.get(
				`/projects/${this._idProject}/sprints/${this._idSprint}`
			);
			return new Sprint(this.client, sprint, this._idProject);
		}
	}

	/**
	 * Get the Epic this Issue belongs in. If it doesn't belong to an epic, returns null
	 * @returns {Object|Null} the Epic
	 */
	async getEpic() {
		if (this._idEpic == null) return null;
		else {
			let { data: epic } = await this.axios.get(
				`/projects/${this._idProject}/epics/${this._idEpic}`
			);
			return new Epic(this.client, epic, this._idProject);
		}
	}

	/**
	 * @returns {Object|Null} If the Issue has a Label assigned, it returns it, else it returns null.
	 */
	async getLabel() {
		if (this._idLabel === null) return null;
		let { data: label } = await this.axios.get(
			`/projects/${this._idProject}/labels/${this._idLabel}`
		);

		return new Label(this.client, label, this._idProject);
	}

	async getColumn() {
		if (this._idColumn === null) return null;
		let p = await this.getProject();
		return await p.getColumn(this._idColumn);
	}

	/**
	 * @returns {Object[]} array of project Members
	 */
	async getAssignees() {
		let { data: members } = await this.axios.get(
			`/projects/${this._idProject}/members`
		);

		let assignees = members.filter(
			(m) => this._assigneeIds.indexOf(m.idUser) !== -1
		);

		return assignees.map(
			(a) => new Member(this.client, a, this._idProject)
		);
	}

	async getComments() {
		let list = new PaginatedList(this.client, {
			url: `/projects/${this._idProject}/issues/${this._code}/comments`,
			dataTransformer: (comments) =>
				comments.map(
					(comment) =>
						new Comment(this.client, comment, this._idProject)
				),
		});

		await list.refresh();
		return list;
	}

	/**
	 * The time (in milliseconds) left until the deadline. Can be negative.
	 * If there's no deadline set, it returns null.
	 * @returns {Number|null}
	 */
	dueIn() {
		if (this.deadline != null) return this.deadline - new Date();
		else return null;
	}

	/**
	 * Whether this issue is done
	 * @returns {Boolean}
	 */
	isDone() {
		return this._idColumn === null;
	}

	/**
	 * Updates the issue's given values. If you want a value to be null, you should supply null.
	 * @param {Object} issueConf the values used to create the issue
	 * @param {String=} issueConf.title The title of the issue
	 * @param {String=} issueConf.category One of 'Story', 'Task', 'Bug'
	 * @param {Number=} issueConf.points Story points
	 * @param {String=} issueConf.priority One of 'Very Low','Low','Neutral','High','Very High'
	 * @param {String=} issueConf.description Issue description
	 * @param {Date=} issueConf.deadline when is this issue due
	 * @param {Number|Null=} issueConf.label the label the new issue will have
	 */
	async update({
		title,
		category,
		points,
		priority,
		description,
		deadline,
		label,
		idColumn,
		assignees,
	}) {
		let labelValue;

		if (label === undefined) labelValue = this._idLabel;
		else if (label === null) labelValue = null;
		else labelValue = label.id;

		let newIssue = {
			title: title != null ? title : this.title,
			idColumn: idColumn !== undefined ? idColumn : this._idColumn,
			idLabel: labelValue,
			category: category != null ? category : this.category,
			points: points !== undefined ? points : this.points,
			priority: priority != null ? priority : this.priority,
			description:
				description !== undefined ? description : this.description,
			deadline: deadline !== undefined ? deadline : this.deadline,
			assignees:
				assignees !== undefined
					? assignees.map((i) => i.id)
					: this._assigneeIds,
		};

		await this.axios.put(
			`/projects/${this._idProject}/issues/${this._code}`,
			newIssue
		);

		await this.refresh();
	}

	/**
	 * @param {object} commentConf
	 * @param {string} commentConf.content the content of the comment
	 * @returns {object} the newly created comment
	 */
	async createComment({ content }) {
		let newComment = { content };
		let {
			data: { idComment },
		} = await this.axios.post(
			`/projects/${this._idProject}/issues/${this._code}/comments`,
			newComment
		);

		return new Comment(
			this.client,
			{
				idComment,
				content,
				timestamp: new Date(),
				idUser: this.client.user.idUser,
			},
			this._idProject
		);
	}
};

const Label = require('./Label');
const Member = require('./Member');
const Project = require('./Project');
const Sprint = require('./Sprint');
const Epic = require('./Epic');
const Comment = require('./Comment');
