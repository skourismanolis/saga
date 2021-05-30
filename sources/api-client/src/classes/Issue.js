const Base = require('./Base');
/****************************************************************************************/
/*                                       WARNING                                        *
/*    Move require's to the end of the file in order to avoid circular references       *
/*                                                                                      *
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
		this.code = code;
		this.title = title;
		this.category = category;
		this.points = points;
		this.priority = priority;
		this.description = description;
		this.deadline = deadline != null ? new Date(deadline) : null;
	}

	getProject() {
		return new Project(this.client, this._idProject);
	}

	/**
	 * @returns {Object|Null} If the Issue has a Label assigned, it returns it, else it returns null.
	 */
	async getLabel() {
		if (this._idLabel === null) return null;
		let { data: label } = this.axios.get(
			`/project/${this._idProject}/labels/${this._idLabel}`
		);
		return new Label(this.client, label, this._idProject);
	}

	/**
	 * @returns {Object[]} array of project Members
	 */
	async getAssignees() {
		let { data: members } = await this.axios.get(
			`/projects/${this._idProject}/members`
		);

		let assignees = members.filter(
			(m) => this._assigneeIds.indexOf(m.id) !== -1
		);

		return assignees.map((a) => new Member(this.client, a));
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
	}) {
		let labelValue;

		if (label === undefined) labelValue = this._idLabel;
		else if (label === null) labelValue = null;
		else labelValue = label.id;

		let newIssue = {
			title: title != null ? title : this.title,
			idColumn: this._idColumn,
			idLabel: labelValue,
			category: category != null ? category : this.category,
			points: points != null ? points : this.points,
			priority: priority != null ? priority : this.priority,
			description:
				description !== undefined ? description : this.description,
			deadline: deadline !== undefined ? deadline : this.deadline,
			assignees: this._assigneeIds,
		};

		await this.axios.put(
			`/projects/${this._idProject}/issues/${this.code}`,
			newIssue
		);
	}
};

const Label = require('./Label');
const Member = require('./Member');
const Project = require('./Project');
