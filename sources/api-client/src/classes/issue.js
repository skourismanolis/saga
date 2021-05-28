module.exports = class Issue {
	constructor() {
		this._idProject = null;
		this._idSprint = null;
		this._idColumn = null;
		this._idEpic = null;
		this.code = null;
		this.title = null;
		this.category = null;
		this.points = null;
		this.priority = null;
		this.description = null;
		this.deadline = null;
	}
};
