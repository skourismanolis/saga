const db = require('../db').db;
const joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const schemas = require('../schemas/schemas_export');
const dayjs = require('dayjs');

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
				dayjs(body.end_date).format('YYYY-MM-DD'),
				body.description,
				body.idLabel,
			]
		);
		if (body.assignees != null) {
			if (members.length != body.assignees.length) {
				res.sendStatus(404);
			}
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

async function issues_get(req, res) {
	try {
		let query_string = 'SELECT * FROM issue WHERE idProject = ?';
		let query_params = [req.params.idProject];
		if (
			req.query.inSprint != null &&
			typeof req.query.inSprint === 'number'
		) {
			query_string += ' AND idSprint = ?';
			query_params.push(req.query.inSprint);
		}
		if (req.query.column != null && typeof req.query.column === 'number') {
			query_string += ' AND idColumn = ?';
			query_params.push(req.query.column);
		}
		if (req.query.inEpic != null && typeof req.query.inEpic === 'number') {
			query_string += ' AND idEpic = ?';
			query_params.push(req.query.inEpic);
		}
		if (
			req.query.assignee != null &&
			typeof req.query.assignee === 'number'
		) {
			query_string +=
				' AND ? IN(SELECT idUser FROM assignee WHERE code = issue.code';
			query_params.push(req.query.assignee);
		}
		if (req.query.label != null && req.query.label.isArray()) {
			query_string += ' AND idLabel IN ?';
			query_params.push(req.query.label);
		}
		const [result] = await db.pool.query(query_string, query_params);
		res.status(200).send(result);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
}

module.exports = {
	issues_create,
	issues_get,
};
