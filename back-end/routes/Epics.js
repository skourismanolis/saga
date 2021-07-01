require('dotenv').config({
	path: process.env.NODE_ENV === 'test' ? '../.env.test' : '../.env',
});
const Joi = require('joi');
const dayjs = require('dayjs');

const db = require('../db').db;
const schemas = require('../schemas/schemas_export');

async function epics_get(req, res) {
	try {
		// building the query
		let myepicquery =
			'SELECT idEpic,title,start,deadline,description FROM epic WHERE idProject = ?';
		let params = [];
		params.push(req.params.idProject);

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
		let limit = req.headers['x-pagination-limit'] || 15; //TODO maybe make global constant
		let offset = req.headers['x-pagination-offset'] || 0;
		myepicquery += ' LIMIT ? OFFSET ?';
		params.push(parseInt(limit));
		params.push(parseInt(offset));

		// // making the queries
		let [epics] = await db.pool.query(myepicquery, params);
		let [count] = await db.pool.query(
			'SELECT COUNT(*) AS count FROM epic WHERE idProject = ?',
			[req.params.idProject]
		);

		res.header('X-Pagination-Total', count[0].count).send(epics);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
		return;
	}
}

async function epics_post(req, res) {
	try {
		Joi.attempt(req.body, schemas.EpicPutPost);
	} catch (error) {
		console.error(error);
		res.status(400).send('Bad request');
		return;
	}

	let conn;
	try {
		conn = await db.pool.getConnection();
		await conn.beginTransaction();

		let start = req.body.start;
		if (start != null) start = dayjs(start).format('YYYY-MM-DD');
		let deadline = req.body.deadline;
		if (deadline != null) deadline = dayjs(deadline).format('YYYY-MM-DD');

		if (
			start != null &&
			deadline != null &&
			dayjs(deadline).isBefore(start)
		) {
			res.status(400).send('Bad request');
			return;
		}

		await conn.query('INSERT INTO epic VALUES (?,?,?,?,?,?)', [
			0,
			req.params.idProject,
			req.body.title,
			start,
			deadline,
			req.body.description,
		]);

		await conn.commit();
		res.sendStatus(200);
	} catch (error) {
		if (conn != null) conn.rollback();

		console.error(error);
		res.sendStatus(500);
		return;
	} finally {
		if (conn != null) conn.rollback();
	}
}

async function get_epic_id(req, res) {
	try {
		let [epic] = await db.pool.query(
			'SELECT idEpic,title,start,deadline,description FROM epic WHERE idEpic = ? AND idProject = ?',
			[req.params.idEpic, req.params.idProject]
		);

		if (epic.length == 0) {
			return res.sendStatus(404);
		}

		res.send(epic);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
		return;
	}
}

async function put_epic_id(req, res) {
	try {
		Joi.attempt(req.body, schemas.EpicPutPost);
	} catch (error) {
		console.error(error);
		res.status(400).send('Bad request');
		return;
	}

	let conn;
	try {
		conn = await db.pool.getConnection();
		await conn.beginTransaction();

		let start = req.body.start;
		if (start != null) start = dayjs(start).format('YYYY-MM-DD');
		let deadline = req.body.deadline;
		if (deadline != null) deadline = dayjs(deadline).format('YYYY-MM-DD');

		if (
			start != null &&
			deadline != null &&
			dayjs(deadline).isBefore(start)
		) {
			res.status(400).send('Bad request');
			return;
		}

		let [results] = await db.pool.query(
			'UPDATE epic SET title = ?, start = ?, deadline = ?, description = ? WHERE idEpic = ? AND idProject = ?',
			[
				req.body.title,
				start,
				deadline,
				req.body.description,
				req.params.idEpic,
				req.params.idProject,
			]
		);
		if (results.affectedRows == 0) {
			res.sendStatus(404);
			return;
		}

		await conn.commit();
		res.sendStatus(200);
	} catch (error) {
		if (conn != null) conn.rollback();

		console.error(error);
		res.sendStatus(500);
		return;
	} finally {
		if (conn != null) conn.rollback();
	}
}

async function delete_epic_id(req, res) {
	let conn;
	try {
		conn = await db.pool.getConnection();
		await conn.beginTransaction();

		await conn.query(
			'UPDATE issue SET idEpic = NULL WHERE idEpic = ? AND idProject = ?',
			[req.params.idEpic, req.params.idProject]
		);
		let [results] = await conn.query(
			'DELETE FROM epic WHERE idEpic = ? AND idProject = ?;',
			[req.params.idEpic, req.params.idProject]
		);

		if (results.affectedRows == 0) {
			res.sendStatus(404);
			return;
		}
		await conn.commit();
		res.sendStatus(200);
	} catch (error) {
		if (conn != null) conn.rollback();

		console.error(error);
		res.sendStatus(500);
		return;
	} finally {
		if (conn != null) conn.rollback();
	}
}

async function get_epic_issues(req, res) {
	try {
		// building the query
		let myissuequery =
			'SELECT code,idEpic,idLabel,idSprint,idColumn,title,category,points,priority,deadline,description FROM issue WHERE idEpic = ? AND idProject = ?';
		let params = [req.params.idEpic, req.params.idProject];

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
		let limit = req.headers['x-pagination-limit'] || 15; //TODO maybe make global constant
		let offset = req.headers['x-pagination-offset'] || 0;
		myissuequery += ' LIMIT ? OFFSET ?';
		params.push(parseInt(limit));
		params.push(parseInt(offset));

		// making the queries
		let [issues] = await db.pool.query(myissuequery, params);
		let [count] = await db.pool.query(
			'SELECT COUNT(*) AS count FROM issue WHERE idEpic = ? AND idProject = ?',
			[req.params.idEpic, req.params.idProject]
		);

		// get and add assignees to response
		let queries = [];
		issues.forEach((issue) => {
			queries.push([
				'SELECT idUser FROM assignee WHERE code = ?',
				[issue.code],
			]);
		});
		let temp = await Promise.all(
			queries.map((q) => db.pool.query(q[0], q[1]))
		);
		temp.forEach((element, index) => {
			let assignees = element[0].map((entry) => entry.idUser);
			issues[index].assignees = assignees;
		});

		res.header('X-Pagination-Total', count[0].count).send(issues);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
		return;
	}
}

async function post_add_issues(req, res) {
	try {
		Joi.attempt(req.body, schemas.StringArray);
	} catch (error) {
		console.error(error);
		res.status(400).send('Bad request');
		return;
	}

	let conn;
	try {
		conn = await db.pool.getConnection();
		await conn.beginTransaction();

		let [results] = await conn.query(
			`UPDATE issue SET idEpic = ?
			WHERE idProject = ? AND code IN (?)
			AND ? IN (
				SELECT idEpic FROM epic WHERE idProject = ?
			)`,
			[
				req.params.idEpic,
				req.params.idProject,
				req.body,
				req.params.idEpic,
				req.params.idProject,
			]
		);

		if (results.affectedRows != req.body.length) {
			if (conn != null) conn.rollback();
			res.sendStatus(404);
			return;
		}

		await conn.commit();
		res.sendStatus(200);
	} catch (error) {
		if (conn != null) conn.rollback();

		console.error(error);
		res.sendStatus(500);
		return;
	} finally {
		if (conn != null) conn.rollback();
	}
}

async function delete_remove_issues(req, res) {
	try {
		Joi.attempt(req.body, schemas.StringArray);
	} catch (error) {
		console.error(error);
		res.status(400).send('Bad request');
		return;
	}

	let conn;
	try {
		conn = await db.pool.getConnection();
		await conn.beginTransaction();

		let [results] = await conn.query(
			`UPDATE issue SET idEpic = NULL
			WHERE idEpic = ? AND idProject = ? AND code IN (?)`,
			[req.params.idEpic, req.params.idProject, req.body]
		);

		console.log(results);

		if (results.affectedRows != req.body.length) {
			if (conn != null) conn.rollback();
			res.sendStatus(404);
			return;
		}

		await conn.commit();
		res.sendStatus(200);
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
	epics_get,
	epics_post,
	get_epic_id,
	put_epic_id,
	delete_epic_id,
	get_epic_issues,
	post_add_issues,
	delete_remove_issues,
};
