require('dotenv').config({ path: '../.env' });
const express = require('express');
const app = express.Router();
// const jwt = require('jsonwebtoken');
const Joi = require('joi');
const Project_auth = require('../functions');

const db = require('../db').db;
const schemas = require('../schemas/schemas_export');

app.get('/', async (req, res) => {
	console.log(req.headers);
	// if (req.params.search == null){}
	let conn;
	let projects;
	let projects_number;
	try {
		let users;
		conn = await db.pool.getConnection();
		await conn.beginTransaction();
		[projects] = await conn.query(
			'						\
			SELECT *				\
			FROM project 			\
			WHERE idProject IN (	\
				SELECT idProject 	\
				FROM member 		\
				WHERE idUser = ?)',
			[req.user.id]
		);
		projects_number = projects.length;
		[users] = await conn.query(
			'																							\
			SELECT user.idUser, user.name, user.surname, member.role, member.idProject, user.picture	\
			FROM user as user,member as member															\
			WHERE user.idUser IN (																		\
				SELECT idUser																			\
				FROM member																				\
				WHERE idProject IN (																	\
					SELECT idProject 																	\
					FROM member 																		\
					WHERE idUser = ?))																	\
				AND user.idUser = member.idUser',
			[req.user.id]
		);
		await conn.commit();
		// create correct project objects
		projects.forEach((project) => {
			// add members property inside projcet
			project.members = [];
			// find the members to add them
			users.forEach((user) => {
				if (user.idProject == project.idProject) {
					delete user.idProject;
					project.members.push(user);
				}
			});
		});
	} catch (error) {
		if (conn != null) conn.rollback();
		console.error(error);
		res.sendStatus(500);
	} finally {
		if (conn != null) conn.release();
	}
	if (
		req.headers['x-pagination-limit'] != null &&
		req.headers['x-pagination-offset'] != null
	) {
		res.status(200)
			.header('X-Pagination-Total', projects_number)
			.send(
				projects.slice(
					req.headers['x-pagination-offset'],
					req.headers['x-pagination-offset'] +
						req.headers['x-pagination-limit']
				)
			);
	}
});

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
			return res.sendStatus(404);
		}
		if (result[0].verified == 0) {
			return res.sendStatus(401);
		}
		conn = await db.pool.getConnection();
		await conn.beginTransaction();
		let [project] = await conn.query(
			'INSERT INTO project (title) VALUES (?)',
			[req.body.title]
		);

		await conn.query(
			'INSERT INTO member (idUser, idProject , role) VALUES (?,(SELECT max(idProject) FROM project),?)',
			[req.user.id, 'Admin']
		);
		await conn.commit();
		res.status(200).send({ message: 'OK', idProject: project.insertId });
	} catch (error) {
		console.error(error);
		if (conn != null) conn.rollback();
		return res.sendStatus(500);
	} finally {
		if (conn != null) conn.release();
	}
});

// app.put(
// 	'/:idProject',
// 	Project_auth(req.params.idProject, 'Admin'),
// 	async (req, res) => {
// 		// try {
// 		// 	Joi.attempt(req.body, schemas.ProjectUpdate);
// 		// } catch (error) {
// 		// 	return res.sendStatus(400);
// 		// }
// 	}
// );

module.exports = app;
