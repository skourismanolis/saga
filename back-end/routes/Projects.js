require('dotenv').config({ path: '../.env' });
const express = require('express');
const app = express.Router();
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const db = require('../db').db;
const schemas = require('../schemas/schemas_export');

// CREATE PROJECT
app.post('/', async (req, res) => {
	let conn;
	try {
		Joi.attempt(req.body, schemas.ProjectCreate);
	} catch (error) {
		return res.sendStatus(400);
	}
	try {
		const [result] = await db.pool.query(
			'SELECT idUser,verified FROM user WHERE idUser = ?',
			[req.user.id]
		);
		if (result.length == 0) {
			return res.sendStatus(401);
		}
		if (result[0].verified == 0) {
			return res.sendStatus(403);
		}
		conn = await db.pool.getConnection();
		await conn.beginTransaction();
		let [project] = await conn.query(
			'INSERT INTO project (title) VALUES (?)',
			[req.body.title]
		);

		await conn.query(
			'INSERT INTO member (idUser, idProject , role) VALUES (?,?,?)',
			[req.user.id, project[0].idProject, 'Admin']
		);
		await conn.commit();

		return res.sendStatus(200);
	} catch (error) {
		console.error(error);
		if (conn != null) conn.rollback();
		return res.sendStatus(500);
	} finally {
		if (conn != null) conn.release();
	}
});

module.exports = app;
