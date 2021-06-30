require('dotenv').config({
	path: process.env.NODE_ENV === 'test' ? '../.env.test' : '../.env',
});
const Joi = require('joi');
const dayjs = require('dayjs');

const db = require('../db').db;
const schemas = require('../schemas/schemas_export');

async function sprints_get(req, res) {
	try {
		// building the query
		let mysprintquery =
			'SELECT s.idSprint,s.title,s.`start`,s.deadline FROM sprint s, project p \
			WHERE s.idProject = ? AND p.idProject = ?';
		let params = [req.params.idProject, req.params.idProject];

		//handling query param finished
		if (req.query.finished == true) {
			mysprintquery +=
				' AND s.`start` IS NOT NULL AND (s.idSprint != p.activeSprint OR p.activeSprint IS NULL)';
		} else if (req.query.finished == false) {
			mysprintquery += ' AND s.`start` IS NULL';
		} else if (req.query.finished != undefined) {
			res.sendStatus(400);
			throw 'bob'; //TODO maybe make global constant
		}

		// handling pagination headers
		if (
			req.headers['x-pagination-limit'] != null &&
			req.headers['x-pagination-offset'] != null &&
			(isNaN(req.headers['x-pagination-limit']) ||
				isNaN(req.headers['x-pagination-offset']))
		) {
			res.sendStatus(400);
			throw 'bob'; //TODO maybe make global constant
		}
		let limit = req.headers['x-pagination-limit'] || 15; //TODO maybe make global constant
		let offset = req.headers['x-pagination-offset'] || 0;
		mysprintquery += ' LIMIT ? OFFSET ?';
		params.push(parseInt(limit));
		params.push(parseInt(offset));

		// making the queries
		let [sprints] = await db.pool.query(mysprintquery, params);

		mysprintquery = mysprintquery.substring(mysprintquery.search('FROM'));
		let [count] = await db.pool.query(
			'SELECT COUNT(s.idSprint) AS count ' + mysprintquery,
			params
		);

		res.header('X-Pagination-Total', count[0].count).send(sprints);
	} catch (error) {
		if (error != 'bob') {
			//TODO maybe make global constant
			console.error(error);
			res.sendStatus(500);
		}
		return;
	}
}

async function sprints_post(req, res) {
	try {
		Joi.attempt(req.body, schemas.SprintPutPost);
	} catch (error) {
		console.error(error);
		res.sendStatus(400);
		return;
	}

	let conn;
	try {
		conn = await db.pool.getConnection();
		await conn.beginTransaction();

		let deadline = req.body.deadline;
		if (deadline != null) deadline = dayjs(deadline).format('YYYY-MM-DD');

		await conn.query('INSERT INTO sprint VALUES (?,?,?,?,?)', [
			0,
			req.params.idProject,
			req.body.title,
			null,
			deadline,
		]);

		await conn.commit();
		res.sendStatus(200);
	} catch (error) {
		if (conn != null) conn.rollback();

		console.error(error);
		res.sendStatus(500);
		return;
	} finally {
		if (conn != null) conn.release();
	}
}

async function get_sprint_id(req, res) {
	try {
		let [sprint] = await db.pool.query(
			'SELECT idSprint,title,start,deadline FROM sprint WHERE idSprint = ? AND idProject = ?',
			[req.params.idSprint, req.params.idProject]
		);

		if (sprint.length == 0) {
			res.sendStatus(404);
			throw 'bob'; //TODO maybe make global constant
		}

		res.send(sprint);
	} catch (error) {
		if (error != 'bob') {
			//TODO maybe make global constant
			console.error(error);
			res.sendStatus(500);
		}
		return;
	}
}

module.exports = {
	sprints_get,
	sprints_post,
	get_sprint_id,
};