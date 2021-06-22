const db = require('../db').db;
const joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const schemas = require('../schemas/schemas_export');

async function issues_create(req, res) {
	let body;
	console.log();
	try {
		body = joi.attempt(req.body, schemas.IssuePost);
	} catch (error) {
		res.sendStatus(400);
		return;
	}
	let conn;
	let code = uuidv4();
	try {
		const [members] = await db.pool.query(
			'SELECT idUser FROM member WHERE idProject = ? and idUser IN(?)',
			[req.params.idProject, body.assignees]
		);
		conn = await db.pool.getConnection();
		await conn.beginTransaction();
		await conn.query(
			'INSERT INTO issue (code, idProject, title, category, points, priority, deadline, description, idLabel) VALUES (?,?,?,?,?,?,?,?,?)',
			[
				code,
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
		if (body.assignees != null) {
			members.forEach(async (assignee) => {
				await conn.query(
					'INSERT INTO assignee (code , idUser) VALUES (?,?)',
					[code, assignee.idUser]
				);
			});
		}
		await conn.commit();
		res.status(200).send({ code });
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
