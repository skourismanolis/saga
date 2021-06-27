require('dotenv').config({
	path: process.env.NODE_ENV === 'test' ? '../.env.test' : '../.env',
});
const express = require('express');
const app = express.Router();
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { Project_auth } = require('../functions');

const db = require('../db').db;
const schemas = require('../schemas/schemas_export');
const members = require('./Members');
const issues = require('./Issues');
const epics = require('./Epics');
const labels = require('./Labels');
const columns = require('./Columns');

app.get('/', async (req, res) => {
	// if (req.params.search == null){}
	try {
		let query_string =
			'SELECT * FROM project WHERE idProject IN ( SELECT idProject FROM member WHERE idUser = ?)';
		let query_params = [req.user.idUser];
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
		if (req.query.search != null) {
			req.query.search = '%' + req.query.search + '%';
			query_string += ' AND title LIKE ?';
			query_params.push(req.query.search);
		}
		let total_pag_query = query_string;
		let total_pag_params = query_params;
		let limit = req.headers['x-pagination-limit'] || 15;
		let offset = req.headers['x-pagination-offset'] || 0;
		query_string += ' LIMIT ? OFFSET ?';
		query_params.push(parseInt(limit));
		query_params.push(parseInt(offset));
		let [projects] = await db.pool.query(query_string, query_params);
		const [result_pag] = await db.pool.query(
			total_pag_query,
			total_pag_params
		);
		let Projects_id = [];
		projects.forEach((project) => {
			Projects_id.push(project.idProject);
		});
		if (Projects_id.length == 0) {
			res.status(200).send([]);
			return;
		}
		let [users] = await db.pool.query(
			`
			SELECT user.idUser, user.name, user.surname, member.role, member.idProject, user.picture
			FROM user, member
			WHERE user.idUser IN (
					SELECT idUser
					FROM member
					WHERE idProject IN (?))
					AND user.idUser = member.idUser`,
			[Projects_id]
		);
		// if (req.query.search == null) {
		// }
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
		// Rename property "title" to "name"
		projects = projects.map(function (obj) {
			obj['name'] = obj['title']; // Assign new key
			delete obj['title']; // Delete old key
			return obj;
		});
		res.status(200)
			.header('X-Pagination-Total', result_pag.length)
			.send(projects);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
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
			[req.user.idUser]
		);
		if (result.length == 0) {
			return res.sendStatus(404);
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
			'INSERT INTO `column`  (idProject, name, `order`) VALUES (?,?,?)',
			[project.insertId, 'TO-DO', 1]
		);
		await conn.query(
			'INSERT INTO `column` (idProject, name, `order`) VALUES (?,?,?)',
			[project.insertId, 'IN PROGRESS', 2]
		);
		// // removed, done issues have idColumn = NULL
		// await conn.query(
		// 	'INSERT INTO `column` (idProject, name, `order`) VALUES (?,?,?)',
		// 	[project.insertId, 'DONE', 3]
		// );
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
		await conn.query('DELETE FROM `column` WHERE idProject = ?', [
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

app.get('/:idProject/invite', Project_auth(['Admin']), async (req, res) => {
	try {
		const emailToken = jwt.sign(
			{
				process: 'invite',
				idProject: req.params.idProject,
			},
			process.env.EMAIL_SECRET
		);

		const url = `http://localhost:8080/token/${emailToken}`;
		res.status(200).send({ inviteLink: url });
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
});

// members
app.get(
	'/:idProject/members/',
	Project_auth(['Admin', 'Member']),
	members.members_get
);

app.delete(
	'/:idProject/members/',
	Project_auth(['Admin']),
	members.members_delete
);

app.post(
	'/:idProject/members/admin/',
	Project_auth(['Admin']),
	members.members_promote
);

app.delete(
	'/:idProject/members/admin/',
	Project_auth(['Admin']),
	members.members_demote
);

app.post(
	'/:idProject/issues/',
	Project_auth(['Admin', 'Member']),
	issues.issues_create
);

app.get(
	'/:idProject/issues/',
	Project_auth(['Admin', 'Member']),
	issues.issues_get
);

// epics
app.get(
	'/:idProject/epics/',
	Project_auth(['Admin', 'Member']),
	epics.epics_get
);

app.post(
	'/:idProject/epics/',
	Project_auth(['Admin', 'Member']),
	epics.epics_post
);

app.get(
	'/:idProject/epics/:idEpic/',
	Project_auth(['Admin', 'Member']),
	epics.get_epic_id
);

app.put(
	'/:idProject/epics/:idEpic/',
	Project_auth(['Admin', 'Member']),
	epics.put_epic_id
);

app.delete(
	'/:idProject/epics/:idEpic/',
	Project_auth(['Admin', 'Member']),
	epics.delete_epic_id
);

app.get(
	'/:idProject/epics/:idEpic/issues',
	Project_auth(['Admin', 'Member']),
	epics.get_epic_issues
);

app.post(
	'/:idProject/epics/:idEpic/issues',
	Project_auth(['Admin', 'Member']),
	epics.post_add_issues
);

app.delete(
	'/:idProject/epics/:idEpic/issues',
	Project_auth(['Admin', 'Member']),
	epics.delete_remove_issues
);

// labels
app.get(
	'/:idProject/labels/',
	Project_auth(['Admin', 'Member']),
	labels.labels_get
);

app.post(
	'/:idProject/labels/',
	Project_auth(['Admin', 'Member']),
	labels.labels_post
);

app.get(
	'/:idProject/labels/:idLabel/',
	Project_auth(['Admin', 'Member']),
	labels.get_label_id
);

app.put(
	'/:idProject/labels/:idLabel/',
	Project_auth(['Admin', 'Member']),
	labels.put_label_id
);

app.delete(
	'/:idProject/labels/:idLabel/',
	Project_auth(['Admin', 'Member']),
	labels.delete_label_id
);

// columns
app.get(
	'/:idProject/columns/',
	Project_auth(['Admin', 'Member']),
	columns.columns_get
);

app.post(
	'/:idProject/columns/',
	Project_auth(['Admin', 'Member']),
	columns.columns_post
);

app.get(
	'/:idProject/columns/:idColumn/',
	Project_auth(['Admin', 'Member']),
	columns.get_column_id
);

app.put(
	'/:idProject/columns/:idColumn/',
	Project_auth(['Admin', 'Member']),
	columns.put_column_id
);

app.delete(
	'/:idProject/columns/:idColumn/',
	Project_auth(['Admin', 'Member']),
	columns.delete_column_id
);

module.exports = app;
