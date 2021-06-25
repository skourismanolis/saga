require('dotenv').config({ path: '../.env' });
const Joi = require('joi');

const db = require('../db').db;
const schemas = require('../schemas/schemas_export');

async function labels_get(req, res) {
	try {
		// building the query
		let myquery = 'SELECT idLabel,name,color FROM label WHERE idProject = ?';
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
		myepicquery += ' LIMIT ? OFFSET ?';
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

module.exports = {
	labels_get,
};
