require('dotenv').config({
	path: process.env.NODE_ENV === 'test' ? '../.env.test' : '../.env',
});
const Joi = require('joi');

const db = require('../db').db;
const schemas = require('../schemas/schemas_export');

async function get_active_sprint(req, res) {
	try {
		let [result] = await db.pool.query(
			`SELECT s.idSprint,s.title,s.start,s.deadline
            FROM sprint s, project p WHERE s.idSprint = p.activeSprint AND s.idProject = p.idProject AND p.idProject = ?`,
			[req.params.idProject]
		);

		res.send(result);
	} catch (error) {
		if (error != 'bob') {
			//TODO maybe make global constant
			console.error(error);
			res.sendStatus(500);
		}
		return;
	}
}

async function put_active_sprint(req, res) {
	try {
		Joi.attempt(req.body.id, schemas.Id);
	} catch (error) {
		console.error(error);
		res.sendStatus(400);
		return;
	}

	let conn;
	try {
		conn = await db.pool.getConnection();
		await conn.beginTransaction();

		let [currentActiveSprint] = await conn.query(
			'SELECT activeSprint FROM project WHERE idProject = ?',
			[req.params.idProject]
		);
		currentActiveSprint = currentActiveSprint[0].activeSprint;

		if (req.body.id != null && currentActiveSprint != null) {
			res.sendStatus(403);
			throw 'bob'; //TODO maybe make global constant
		} else if (req.body.id != null) {
			let [results] = await conn.query(
				`UPDATE project SET activeSprint = ? 
                WHERE idProject = ? AND ? IN (SELECT idSprint FROM sprint WHERE idProject = ?)`,
				[
					req.body.id,
					req.params.idProject,
					req.body.id,
					req.params.idProject,
				]
			);
			await conn.query(
				'UPDATE sprint SET `start` = CURRENT_DATE WHERE idSprint = ?',
				[req.body.id]
			);
			if (results.affectedRows == 0) {
				res.sendStatus(404);
				throw 'bob'; //TODO maybe make global constant
			}
		} else if (currentActiveSprint != null) {
			let [results] = await conn.query(
				'UPDATE project SET activeSprint = NULL WHERE idProject = ?',
				[req.params.idProject]
			);
			if (results.affectedRows == 0) {
				res.sendStatus(404);
				throw 'bob'; //TODO maybe make global constant
			}
		}

		await conn.commit();
		res.sendStatus(200);
	} catch (error) {
		if (conn != null) conn.rollback();

		if (error != 'bob') {
			//TODO maybe make global constant
			console.error(error);
			res.sendStatus(500);
		}
		return;
	} finally {
		if (conn != null) conn.release();
	}
}

module.exports = {
	get_active_sprint,
	put_active_sprint,
};