require('dotenv').config({ path: '../.env' });
// const express = require('express');
// const app = express.Router();
// const jwt = require('jsonwebtoken');
// const Joi = require('joi');
// const { Project_auth } = require('../functions');

const db = require('../db').db;
// const schemas = require('../schemas/schemas_export');

async function epics_get(req, res) {
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

		conn.query('SELECT * FROM epic WHERE idProject = ?', [
			req.params.idProject,
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

	if (
		req.headers['x-pagination-limit'] != null &&
		req.headers['x-pagination-offset'] != null
	) {
		projects = projects.slice(
			req.headers['x-pagination-offset'],
			req.headers['x-pagination-offset'] +
				req.headers['x-pagination-limit']
		);
	}
	// Rename property "title" to "name"
	projects = projects.map(function (obj) {
		obj['name'] = obj['title']; // Assign new key
		delete obj['title']; // Delete old key
		return obj;
	});
	res.status(200)
		.header('X-Pagination-Total', projects_number)
		.send(projects);
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

		await conn.query('INSERT INTO epic VALUES (?,?,?,?,?,?)', [
			0,
			req.params.idProject,
			req.body.title,
			req.body.start,
			req.body.deadline,
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

module.exports = {
	epics_get,
	epics_post,
};
