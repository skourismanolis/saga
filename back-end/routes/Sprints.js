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
		let myepicquery =
			'SELECT idSprint,title,start,deadline FROM sprint WHERE idProject = ?';
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
			throw 'bob'; //TODO maybe make global constant
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
		if (error != 'bob') //TODO maybe make global constant
			console.error(error);
			res.sendStatus(500);
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

module.exports = {
	sprints_get,
	sprints_post,
};