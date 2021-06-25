require('dotenv').config({ path: '../.env' });
const Joi = require('joi');

const db = require('../db').db;
const schemas = require('../schemas/schemas_export');

async function labels_get(req, res) {
	try {
		// building the query
		let myquery =
			'SELECT idLabel,name,color FROM label WHERE idProject = ?';
		let params = [req.params.idProject];

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
		myquery += ' LIMIT ? OFFSET ?';
		params.push(parseInt(limit));
		params.push(parseInt(offset));

		// // making the queries
		let [labels] = await db.pool.query(myquery, params);
		let [count] = await db.pool.query(
			'SELECT COUNT(*) AS count FROM epic WHERE idProject = ?',
			[req.params.idProject]
		);

		res.header('X-Pagination-Total', count[0].count).send(labels);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
		return;
	}
}

async function labels_post(req, res) {
	try {
		Joi.attempt(req.body, schemas.LabelPutPost);
	} catch (error) {
		console.error(error);
		res.status(400).send('Bad request');
		return;
	}

	let conn;
	try {
		conn = await db.pool.getConnection();
		await conn.beginTransaction();

		await conn.query('INSERT INTO label VALUES (?,?,?,?)', [
			0,
			req.params.idProject,
			req.body.name,
			req.body.color,
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
module.exports = {
	labels_get,
	labels_post,
};
