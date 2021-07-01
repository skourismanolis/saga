const Base = require('./Base');
/****************************************************************************************/
/*                                       WARNING                                        */
/*    Move require's to the end of the file in order to avoid circular references       */
/*                                                                                      */
/****************************************************************************************/

module.exports = class Comment extends Base {
	constructor(client, { idComment, content, timestamp, idUser }) {
		super(client);
		this._idComment = idComment;
		this._idUser = idUser;
		this.content = content;
		this.timestamp = new Date(timestamp);
	}

	get id() {
		return this._idComment;
	}

	toJSON() {
		return JSON.stringify({
			idComment: this._idComment,
			idUser: this._idUser,
			content: this.content,
			timestamp: this.timestamp,
		});
	}
};
