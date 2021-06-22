require('dotenv').config({ path: '../.env' });
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
		let limit = req.headers['x-pagination-limit'] || 15;
		let offset = req.headers['x-pagination-offset'] || 0;
		myepicquery += ' LIMIT ? OFFSET ?';
		params.push(parseInt(limit));
		params.push(parseInt(offset));

		// making the queries
		let [epics] = await db.pool.query(myepicquery, params);

		res.send(epics);
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
		if (start != null) start = dayjs().format('YYYY-MM-DD');
		let deadline = req.body.deadline;
		if (deadline != null) deadline = dayjs().format('YYYY-MM-DD');

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
			'SELECT idEpic,title,start,deadline,description FROM epic WHERE idEpic = ?',
			[req.params.idEpic]
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
		let start = req.body.start;
		if (start != null) start = dayjs(start).format('YYYY-MM-DD');
		let deadline = req.body.deadline;
		if (deadline != null) deadline = dayjs(deadline).format('YYYY-MM-DD');

		await db.pool.query(
			'UPDATE epic SET title = ?, start = ?, deadline = ?, description = ? WHERE idEpic = ?',
			[
				req.body.title,
				start,
				deadline,
				req.body.description,
				req.params.idEpic,
			]
		);

		res.sendStatus(200);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
		return;
	}
}

module.exports = {
	epics_get,
	epics_post,
	get_epic_id,
	put_epic_id,
};
