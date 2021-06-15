require('dotenv').config({ path: '../.env' });
const express = require('express');
const app = express.Router();
// const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { Project_auth } = require('../functions');

const db = require('../db').db;
const schemas = require('../schemas/schemas_export');

app.get('/', async (req, res) => {
	// if (req.params.search == null){}
	let conn;
	let projects;
	let projects_number = 0;
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
			[req.user.idUser]
		);
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
			[req.user.idUser]
		);
		await conn.commit();
		if (req.query.search == null) {
			projects_number = projects.length;
		}
		// create correct project objects
		projects.forEach((project) => {
			// clear out the ones with no match
			if (req.query.search != null) {
				if (project.title.search(req.query.search) < 0) {
					// remove project from list, and go to check project
					projects = projects.filter(
						(pro) => pro.idProject != project.idProject
					);
					return;
				} else {
					projects_number++;
				}
			}
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
		projects = projects.slice(
			req.headers['x-pagination-offset'],
			req.headers['x-pagination-offset'] +
				req.headers['x-pagination-limit']
		);
	}
	res.status(200)
		.header('X-Pagination-Total', projects_number)
		.send(projects);
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
			[req.user.idUser]
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
			'INSERT INTO kanban  (idProject, name, column_order) VALUES (?,?,?)',
			[project.insertId, 'TO-DO', 1]
		);
		await conn.query(
			'INSERT INTO kanban (idProject, name, column_order) VALUES (?,?,?)',
			[project.insertId, 'IN PROGRESS', 2]
		);
		await conn.query(
			'INSERT INTO kanban (idProject, name, column_order) VALUES (?,?,?)',
			[project.insertId, 'DONE', 3]
		);
		await conn.query(
			'INSERT INTO member (idUser, idProject , role) VALUES (?,?,?)',
			[req.user.idUser, project.insertId, 'Admin']
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

app.put('/:idProject', Project_auth(['Admin']), async (req, res) => {
	try {
		Joi.attempt(req.body, schemas.ProjectUpdate);
	} catch (error) {
		return res.sendStatus(400);
	}
	try {
		const [project] = await db.pool.query(
			'SELECT * FROM project WHERE idProject = ?',
			[req.params.idProject]
		);
		if (project.length == 0) {
			res.sendStatus(404);
		}
		let picture_name;
		if (req.body.picture == null) {
			picture_name = project[0].picture;
		} else {
			picture_name = req.body.picture;
		}
		await db.pool.query(
			'UPDATE project SET picture = ?, title = ? WHERE idProject = ?',
			[picture_name, req.body.title, req.params.idProject]
		);
		res.sendStatus(200);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
});

app.delete('/:idProject', Project_auth(['Admin']), async (req, res) => {
	let conn;
	try {
		conn = await db.pool.getConnection();
		await conn.beginTransaction();
		await conn.query(
			'DELETE FROM assignee WHERE code IN (SELECT code FROM issue WHERE idProject = ?)',
			[req.params.idProject]
		);
		await conn.query(
			'DELETE FROM comment WHERE code IN (SELECT code FROM issue WHERE idProject = ?)',
			[req.params.idProject]
		);
		await conn.query('DELETE FROM issue WHERE idProject = ?', [
			req.params.idProject,
		]);
		await conn.query('DELETE FROM kanban WHERE idProject = ?', [
			req.params.idProject,
		]);
		await conn.query('DELETE FROM epic WHERE idProject = ?', [
			req.params.idProject,
		]);
		await conn.query('DELETE FROM label WHERE idProject = ?', [
			req.params.idProject,
		]);
		await conn.query('DELETE FROM member WHERE idProject = ?', [
			req.params.idProject,
		]);
		await conn.query('DELETE FROM sprint WHERE idProject = ?', [
			req.params.idProject,
		]);
		await conn.query('DELETE FROM project WHERE idProject = ?', [
			req.params.idProject,
		]);

		await conn.commit();
		res.sendStatus(200);
	} catch (error) {
		if (conn != null) conn.rollback();
		res.sendStatus(500);
	} finally {
		if (conn != null) conn.rollback();
	}
});

module.exports = app;
