const db = require('../db').db;
const joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const schemas = require('../schemas/schemas_export');

async function issues_create(req, res) {
	let body;
	try {
		body = joi.attempt(req.body, schemas.IssuePost);
	} catch (error) {
		res.sendStatus(400);
		return;
	}
	let conn;
	try {
		const [members] = db.pool.query(
			'SELECT idUser FROM member WHERE idProject = ?',
			[req.params.idProject]
		);
		let assign = [];
		body.assignees.forEach((assignee) => {
			if (members.find(assignee.idUser)) {
				assign.push(assignee);
			}
		});
		conn = await db.pool.getConnection();
		await conn.beginTransaction();
		await conn.query(
			'INSERT INTO issue SET (code, idProject, title, category, points, priority, deadline, description, idLabel) VALUES (?,?,?,?,?,?,?,?,?)',
			[
				uuidv4(),
				req.params.idProject,
				body.title,
				body.category,
				body.points,
				body.priority,
				body.deadline,
				body.description,
				body.idLabel,
			]
		);
		// TODO add assign INTO SQL assignee
		await conn.commit();
	} catch (error) {
		if (conn != null) conn.rollback();
		console.error(error);
		res.sendStatus(500);
		return;
	} finally {
		if (conn != null) conn.rollback();
	}
}

module.exports = {
	issues_create,
};
