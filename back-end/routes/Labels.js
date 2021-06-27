require('dotenv').config({
	path: process.env.NODE_ENV === 'test' ? '../.env.test' : '../.env',
});
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
			'SELECT COUNT(*) AS count FROM label WHERE idProject = ?',
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

async function get_label_id(req, res) {
	try {
		let [label] = await db.pool.query(
			'SELECT idLabel,name,color FROM label WHERE idLabel = ?',
			[req.params.idLabel]
		);

		if (label.length == 0) {
			return res.sendStatus(404);
		}

		res.send(label);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
		return;
	}
}

async function put_label_id(req, res) {
	try {
		Joi.attempt(req.body, schemas.LabelPutPost);
	} catch (error) {
		console.error(error);
		res.status(400).send('Bad request');
		return;
	}

	try {
		let [results] = await db.pool.query(
			'UPDATE label SET name = ?, color = ? WHERE idLabel = ? AND idProject = ?',
			[
				req.body.name,
				req.body.color,
				req.params.idLabel,
				req.params.idProject,
			]
		);
		if (results.affectedRows == 0) {
			res.sendStatus(404);
			return;
		}

		res.sendStatus(200);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
		return;
	}
}

async function delete_label_id(req, res) {
	let conn;
	try {
		conn = await db.pool.getConnection();
		await conn.beginTransaction();

		await conn.query(
			'UPDATE issue SET idLabel = NULL WHERE idLabel = ? AND idProject = ?',
			[req.params.idLabel, req.params.idProject]
		);
		let [label] = await conn.query(
			'DELETE FROM label WHERE idLabel = ? AND idProject = ?;',
			[req.params.idLabel, req.params.idProject]
		);

		if (label.affectedRows == 0) {
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
	labels_get,
	labels_post,
	get_label_id,
	put_label_id,
	delete_label_id,
};
