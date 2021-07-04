const db = require('../db').db;
const joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const schemas = require('../schemas/schemas_export');
const dayjs = require('dayjs');
const c = require('../constants');

async function issues_create(req, res) {
	let body;
	try {
		body = joi.attempt(req.body, schemas.IssuePost);
	} catch (error) {
		res.sendStatus(400);
		return;
	}
	let conn;
	let code = uuidv4();
	try {
		conn = await db.pool.getConnection();
		await conn.beginTransaction();

		if (req.body.idLabel != null) {
			let [label] = await conn.query(
				'SELECT * FROM label WHERE idLabel = ?',
				[req.body.idLabel]
			);
			if (label.length == 0) {
				res.sendStatus(404);
				throw c.INVALID_TRANSACTION;
			}
		}

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
		if (body.assignees != null && body.assignees.length > 0) {
			const [members] = await conn.query(
				'SELECT idUser FROM member WHERE idProject = ? and idUser IN(?)',
				[req.params.idProject, body.assignees]
			);
			if (members.length != body.assignees.length) {
				res.sendStatus(404);
				throw c.INVALID_TRANSACTION;
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
	} finally {
		if (conn != null) conn.release();
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
				return;
			}
			query_string += ' AND idSprint = ?';
			query_params.push(req.query.inSprint);
		}
		if (req.query.column != null) {
			if (isNaN(req.query.column)) {
				res.sendStatus(400);
				return;
			}
			query_string += ' AND idColumn = ?';
			query_params.push(req.query.column);
		}
		if (req.query.inEpic != null) {
			if (isNaN(req.query.inEpic)) {
				res.sendStatus(400);
				return;
			}
			query_string += ' AND idEpic = ?';
			query_params.push(req.query.inEpic);
		}
		if (req.query.assignee != null) {
			if (isNaN(req.query.assignee)) {
				res.sendStatus(400);
				return;
			}
			query_string +=
				' AND ? IN(SELECT idUser FROM assignee WHERE code = issue.code)';
			query_params.push(req.query.assignee);
		}
		if (req.query.label != null) {
			let label = req.query.label
				.substr(1, req.query.label.length - 2)
				.split(',');
			query_string += ' AND idLabel IN(?)';
			query_params.push(label);
		}
		if (req.query.search != null) {
			req.query.search = '%' + req.query.search + '%';
			query_string += ' AND title LIKE ?';
			query_params.push(req.query.search);
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
		conn = await db.pool.getConnection();
		await conn.beginTransaction();
		let [result] = await conn.query(query_string, query_params);
		const [result_pag] = await conn.query(
			total_pag_query,
			total_pag_params
		);
		conn.commit();
		if (result.length == 0) {
			res.status(200).send([]);
			throw c.INVALID_TRANSACTION;
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
		res.status(200).header('X-Pagination-Total', result_pag).send(result);
	} catch (error) {
		if (conn != null) conn.rollback();

		if (error != c.INVALID_TRANSACTION) {
			console.error(error);
			res.sendStatus(500);
		}
		return;
	} finally {
		if (conn != null) conn.release();
	}
}

async function get_issue_code(req, res) {
	try {
		let [issue] = await db.pool.query(
			'SELECT * FROM issue WHERE code = ? AND idProject = ?',
			[req.params.code, req.params.idProject]
		);
		if (issue.length == 0) {
			return res.sendStatus(404);
		}
		let [members] = await db.pool.query(
			'SELECT idUser FROM assignee WHERE code = ?',
			[req.params.code]
		);
		issue[0].assignees = [];
		if (members.length > 0) {
			members.forEach((member) => {
				issue[0].assignees.push(member.idUser);
			});
		}
		res.status(200).send(issue[0]);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
}

async function delete_issue(req, res) {
	let conn;
	try {
		const [issue] = await db.pool.query(
			'SELECT * FROM issue WHERE code = ? AND idProject = ?',
			[req.params.code, req.params.idProject]
		);
		if (issue.length == 0) {
			res.sendStatus(404);
			throw c.INVALID_TRANSACTION;
		}
		// comment assignee issue
		conn = await db.pool.getConnection();
		await conn.beginTransaction();
		// prettier-ignore
		await conn.query('DELETE FROM comment WHERE code = ?', [req.params.code]);
		//prettier-ignore
		await conn.query('DELETE FROM assignee WHERE code = ?', [req.params.code]);
		await conn.query('DELETE FROM issue WHERE code = ?', [req.params.code]);

		conn.commit();
		res.sendStatus(200);
	} catch (error) {
		if (conn != null) conn.rollback();

		if (error != c.INVALID_TRANSACTION) {
			console.error(error);
			res.sendStatus(500);
		}
		return;
	} finally {
		if (conn != null) conn.release();
	}
}

async function put_issue(req, res) {
	try {
		joi.attempt(req.body, schemas.IssuePut);
	} catch (error) {
		return res.sendStatus(400);
	}

	let conn;
	try {
		const [result] = await db.pool.query(
			'SELECT * FROM issue WHERE code = ? AND idProject = ?',
			[req.params.code, req.params.idProject]
		);
		if (result.length == 0) {
			return res.sendStatus(404);
		}
		const [query_members_before] = await db.pool.query(
			'SELECT idUser FROM assignee WHERE code = ?',
			[req.params.code]
		);
		let members_before = [];
		if (query_members_before.length != 0) {
			query_members_before.forEach((member) => {
				members_before.push(member.idUser);
			});
		}
		let members_after = [];
		if (req.body.assignees != null && req.body.assignees.length != 0) {
			req.body.assignees.forEach((member) => {
				members_after.push(member);
			});
			let [members_after_check] = await db.pool.query(
				'SELECT * FROM member WHERE idProject = ? AND idUser IN (?)',
				[req.params.idProject, members_after]
			);
			if (members_after_check.length != members_after.length) {
				return res.sendStatus(404);
			}
		}
		let check_result;
		// check if label really exists
		if (req.body.idLabel != null) {
			[check_result] = await db.pool.query(
				'SELECT idLabel FROM label WHERE idProject = ? AND idLabel = ?',
				[req.params.idProject, req.body.idLabel]
			);
			if (check_result.length == 0) {
				return res.sendStatus(404);
			}
		}
		// check if column really exists
		if (req.body.idColumn != null) {
			[check_result] = await db.pool.query(
				'SELECT idColumn FROM `column` WHERE idProject = ? AND idColumn = ?',
				[req.params.idProject, req.body.idColumn]
			);
			if (check_result.length == 0) {
				return res.sendStatus(404);
			}
		}
		conn = await db.pool.getConnection();
		await conn.beginTransaction();
		if (req.body.deadline != null)
			req.body.deadline = dayjs(req.body.deadline).format('YYYY-MM-DD');
		await conn.query(
			'UPDATE issue SET idLabel = ?, category = ?, idColumn = ?, priority = ?, title = ?, points = ?, deadline = ?, description = ? WHERE code = ?',
			[
				req.body.idLabel,
				req.body.category,
				req.body.idColumn,
				req.body.priority,
				req.body.title,
				req.body.points,
				req.body.deadline,
				req.body.description,
				req.params.code,
			]
		);
		// delete old assignees
		if (members_before.length > 0) {
			await members_before.forEach(async (member) => {
				await conn.query(
					'DELETE FROM assignee WHERE code = ? AND idUser = ?',
					[req.params.code, member]
				);
			});
		}
		// add new assignees
		if (members_after.length > 0) {
			await members_after.forEach(async (member) => {
				await conn.query(
					'INSERT INTO assignee (code, idUser) VALUES (?, ?)',
					[req.params.code, member]
				);
			});
		}
		await conn.commit();
		res.sendStatus(200);
	} catch (error) {
		if (conn != null) conn.rollback();
		console.error(error);
		res.sendStatus(500);
	} finally {
		if (conn != null) conn.release();
	}
}

async function get_comments(req, res) {
	let conn;
	try {
		const [result] = await db.pool.query(
			'SELECT * FROM issue WHERE code = ? AND idProject = ?',
			[req.params.code, req.params.idProject]
		);
		if (result.length == 0) {
			return res.sendStatus(404);
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
		let query_string = 'SELECT * FROM comment WHERE code = ?';
		let query_params = [req.params.code];
		let total_pag_query = query_string;
		let total_pag_params = query_params;
		let limit = req.headers['x-pagination-limit'] || 15;
		let offset = req.headers['x-pagination-offset'] || 0;
		query_string += ' LIMIT ? OFFSET ?';
		query_params.push(parseInt(limit));
		query_params.push(parseInt(offset));
		conn = await db.pool.getConnection();
		await conn.beginTransaction();
		let [comments] = await conn.query(query_string, query_params);
		const [result_pag] = await conn.query(
			total_pag_query,
			total_pag_params
		);
		res.status(200).header('X-Pagination-Total', result_pag).send(comments);
	} catch (error) {
		if (conn != null) conn.rollback();
		console.error(error);
		res.sendStatus(500);
	} finally {
		if (conn != null) conn.release();
	}
}

async function create_comment(req, res) {
	try {
		joi.attempt(req.body, schemas.CommentPost);
	} catch (error) {
		return res.sendStatus(400);
	}
	let conn;
	try {
		const [result] = await db.pool.query(
			'SELECT * FROM issue WHERE code = ? AND idProject = ?',
			[req.params.code, req.params.idProject]
		);
		if (result.length == 0) {
			return res.sendStatus(404);
		}

		conn = await db.pool.getConnection();
		await conn.beginTransaction();
		let [project] = await conn.query(
			'INSERT INTO comment (code,content,idUser,timestamp) VALUES (?,?,?,?)',
			[
				req.params.code,
				req.body.content,
				req.user.idUser,
				dayjs().format('YYYY-MM-DD'),
			]
		);
		conn.commit();
		res.status(200).send({ idComment: project.insertId });
	} catch (error) {
		if (conn != null) conn.rollback();
		console.error(error);
		res.sendStatus(500);
	} finally {
		if (conn != null) conn.release();
	}
}

async function delete_comment(req, res) {
	try {
		if (req.body.idComment != null) {
			if (isNaN(req.body.idComment)) {
				res.sendStatus(400);
				return;
			}
		}
		const [result] = await db.pool.query(
			'SELECT * FROM comment WHERE code = ? AND idComment = ?',
			[req.params.code, req.body.idComment]
		);
		if (result.length == 0) {
			return res.sendStatus(404);
		}
		if (result[0].idUser != req.user.idUser) {
			return res.sendStatus(403);
		}
		// prettier-ignore
		await db.pool.query('DELETE FROM comment WHERE  idComment = ?', [req.body.idComment]);
		res.sendStatus(200);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
}

module.exports = {
	issues_create,
	issues_get,
	get_issue_code,
	delete_issue,
	put_issue,
	get_comments,
	create_comment,
	delete_comment,
};
