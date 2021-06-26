require('dotenv').config({ path: '../.env' });
const Joi = require('joi');

const db = require('../db').db;
const schemas = require('../schemas/schemas_export');

async function columns_get(req, res) {
	try {
		// building the query
		let myquery =
			'SELECT `idColumn`,`name`,`order` FROM `column` WHERE idProject = ? ORDER BY `order` ASC';
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
		let [columns] = await db.pool.query(myquery, params);
		let [count] = await db.pool.query(
			'SELECT COUNT(*) AS count FROM `column` WHERE idProject = ?',
			[req.params.idProject]
		);

		res.header('X-Pagination-Total', count[0].count).send(columns);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
		return;
	}
}

async function columns_post(req, res) {
	try {
		Joi.attempt(req.body, schemas.ColumnPutPost);
	} catch (error) {
		console.error(error);
		res.status(400).send('Bad request');
		return;
	}

	let conn;
	try {
		conn = await db.pool.getConnection();
		await conn.beginTransaction();

		let [maxOrder] = await db.pool.query(
			'SELECT MAX(`order`) AS max FROM `column` WHERE idProject = ?',
			[req.params.idProject]
		);
		maxOrder = maxOrder[0].max;
		if (maxOrder + 1 < req.body.order) req.body.order = maxOrder + 1;

		await conn.query(
			'UPDATE `column` SET `order` = `order` + 1 WHERE `order` >= ? AND idProject = ?',
			[req.body.order, req.params.idProject]
		);
		await conn.query(
			'INSERT INTO `column` (idProject,`name`,`order`) VALUES (?,?,?)',
			[req.params.idProject, req.body.name, req.body.order]
		);

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

async function get_column_id(req, res) {
	try {
		let [column] = await db.pool.query(
			'SELECT idColumn,`name`,`order` FROM `column` WHERE idColumn = ? AND idProject = ?',
			[req.params.idColumn, req.params.idProject]
		);

		if (column.length == 0) {
			return res.sendStatus(404);
		}

		res.send(column);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
		return;
	}
}

async function put_column_id(req, res) {
	try {
		Joi.attempt(req.body, schemas.ColumnPutPost);
	} catch (error) {
		console.error(error);
		res.status(400).send('Bad request');
		return;
	}

	let conn;
	try {
		conn = await db.pool.getConnection();
		await conn.beginTransaction();

		let [maxOrder] = await conn.query(
			'SELECT MAX(`order`) AS max FROM `column` WHERE idProject = ?',
			[req.params.idProject]
		);
		maxOrder = maxOrder[0].max;
		if (maxOrder + 1 < req.body.order) req.body.order = maxOrder;
		let [currentOrder] = await conn.query(
			'SELECT `order` FROM `column` WHERE idColumn = ? AND idProject = ?',
			[req.params.idColumn, req.params.idProject]
		);
		if (currentOrder.length == 0) {
			res.sendStatus(404);
			return;
		}
		currentOrder = currentOrder[0].order;

		if (req.body.order > currentOrder) {
			await conn.query(
				'UPDATE `column` SET `order` = `order`-1 WHERE `order` > ? AND `order` <= ? AND idProject = ?',
				[currentOrder, req.body.order, req.params.idProject]
			);
		} else if (req.body.order < currentOrder) {
			await conn.query(
				'UPDATE `column` SET `order` = `order`+1 WHERE `order` < ? AND `order` >= ? AND idProject = ?',
				[currentOrder, req.body.order, req.params.idProject]
			);
		}
		let [results] = await conn.query(
			'UPDATE `column` SET `name` = ?, `order` = ? WHERE idColumn = ? AND idProject = ?',
			[
				req.body.name,
				req.body.order,
				req.params.idColumn,
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

async function delete_column_id(req, res) {
	let conn;
	try {
		conn = await db.pool.getConnection();
		await conn.beginTransaction();

		let [currentOrder] = await conn.query(
			'SELECT `order` FROM `column` WHERE idColumn = ? AND idProject = ?',
			[req.params.idColumn, req.params.idProject]
		);
		if (currentOrder.length == 0) {
			res.sendStatus(404);
			return;
		}
		currentOrder = currentOrder[0].order;

		await conn.query(
			'UPDATE issue SET idColumn = 0 WHERE idColumn = ? AND idProject = ?',
			[req.params.idColumn, req.params.idProject]
		);
		let [column] = await conn.query(
			'DELETE FROM `column` WHERE idColumn = ? AND idProject = ?;',
			[req.params.idColumn, req.params.idProject]
		);
		await conn.query(
			'UPDATE `column` SET `order` = `order`-1 WHERE `order` > ? AND idProject = ?',
			[currentOrder, req.params.idProject]
		);

		if (column.affectedRows == 0) {
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
	columns_get,
	columns_post,
	get_column_id,
	put_column_id,
	delete_column_id,
};
