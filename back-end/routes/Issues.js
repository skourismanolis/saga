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
	let conn;
	try {
		let query_string = 'SELECT * FROM issue WHERE idProject = ?';
		let query_params = [req.params.idProject];
		if (req.query.inSprint != null) {
			if (isNaN(req.query.inSprint)) {
				res.sendStatus(400);
			}
			query_string += ' AND idSprint = ?';
			query_params.push(req.query.inSprint);
		}
		if (req.query.column != null) {
			if (isNaN(req.query.column)) {
				res.sendStatus(400);
			}
			query_string += ' AND idColumn = ?';
			query_params.push(req.query.column);
		}
		if (req.query.inEpic != null) {
			if (isNaN(req.query.inEpic)) {
				res.sendStatus(400);
			}
			query_string += ' AND idEpic = ?';
			query_params.push(req.query.inEpic);
		}
		if (req.query.assignee != null) {
			if (isNaN(req.query.assignee)) {
				res.sendStatus(400);
			}
			query_string +=
				' AND ? IN(SELECT idUser FROM assignee WHERE code = issue.code)';
			query_params.push(req.query.assignee);
		}
		if (req.query.label != null) {
			if (Array.isArray(req.query.label) == false) {
				res.sendStatus(500);
			}
			query_string += ' AND idLabel IN(?)';
			query_params.push(req.query.label);
		}
		// handling pagination headers
		if (
			req.headers['x-pagination-limit'] != null &&
			req.headers['x-pagination-offset'] != null &&
			(isNaN(req.headers['x-pagination-limit']) ||
				isNaN(req.headers['x-pagination-offset']))
		) {
			res.sendStatus(400);
			return;
		}
		let total_pag_query = query_string;
		let total_pag_params = query_params;
		let limit = req.headers['x-pagination-limit'] || 15;
		let offset = req.headers['x-pagination-offset'] || 0;
		query_string += ' LIMIT ? OFFSET ?';
		query_params.push(parseInt(limit));
		query_params.push(parseInt(offset));
		console.log(query_string);
		conn = await db.pool.getConnection();
		await conn.beginTransaction();
		let [result] = await conn.query(query_string, query_params);
		const [result_pag] = await conn.query(
			total_pag_query,
			total_pag_params
		);
		conn.commit();
		console.log(result);
		if (result.length == 0) {
			res.sendStatus(404);
			return;
		}

		let codes = [];
		result.forEach((result) => {
			codes.push(result.code);
		});
		let [assignee] = await db.pool.query(
			'SELECT * FROM assignee WHERE code IN (?)',
			[codes]
		);
		// make assignees arrays
		result.forEach((results) => {
			// add assignees property inside result
			results.assignees = [];
			// add each assignee to correct issue
			assignee.forEach((assign) => {
				if (assign.code == results.code) {
					delete assign.code;
					results.assignees.push(assign.idUser);
				}
			});
		});
		// search via string filter
		console.log(req.query);
		if (req.query.search != null) {
			result.forEach((results) => {
				// clear out the ones with no match to search-string
				console.log(results.title);
				if (results.title.search(req.query.search) < 0) {
					// remove issue from list
					result = result.filter(
						(resu) => resu.title != results.title
					);
					return;
				}
			});
		}

		res.status(200).header('X-Pagination-Total', result_pag).send(result);
	} catch (error) {
		console.error(error);
		if (conn != null) conn.rollback();
		res.sendStatus(500);
	} finally {
		if (conn != null) conn.rollback();
	}
}

module.exports = {
	issues_create,
	issues_get,
};
