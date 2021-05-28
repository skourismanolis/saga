const Base = require('./Base');
const Member = require('./Member');
const Project = require('./Project');

module.exports = class Issue extends Base {
	constructor(
		client,
		{
			idProject,
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
		}
	) {
		super(client);
		this._idProject = idProject;
		this._idSprint = idSprint;
		this._idColumn = idColumn;
		this._idEpic = idEpic;
		this._idLabel = idLabel;
		this._assigneeIds = assignees;
		this.code = code;
		this.title = title;
		this.category = category;
		this.points = points;
		this.priority = priority;
		this.description = description;
		this.deadline = deadline != null ? new Date(deadline) : null;
	}

	async getProject() {
		let { data: project } = await this.axios.get(
			`/projects/${this._idProject}`
		);
		return new Project(this.client, project);
	}

	/**
	 * @returns {Object[]} array of project Members
	 */
	async getAsignees() {
		let { data: members } = this.axios.get(
			`/project/${this._idProject}/members`
		);

		let asignees = members.filter(
			(m) => this._assigneeIds.indexOf(m.id) !== -1
		);

		return asignees.map((a) => new Member(this.client, a));
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
	 * @param {Object} newIssue omitting any of the properties uses the previous value
	 */
	async update({ title, category, points, priority, description, deadline }) {
		let newIssue = {
			title: title !== null ? title : this.title,
			idColumn: this._idColumn,
			idLabel: this._idLabel,
			category: category !== null ? category : this.category,
			points: points !== null ? points : this.points,
			priority: priority !== null ? priority : this.priority,
			description:
				description !== description ? description : this.description,
			deadline: deadline !== null ? deadline : this.deadline,
		};

		await this.axios.put(
			`/projects/${this._idProject}/issues/${this.code}`,
			newIssue
		);
	}
};
