require('dotenv').config({ path: '../.env' });
// const express = require('express');
// const app = express.Router();
// const jwt = require('jsonwebtoken');
// const Joi = require('joi');
// const { Project_auth } = require('../functions');

const db = require('../db').db;
// const schemas = require('../schemas/schemas_export');

async function members_get(req, res) {
	try {
		let [users] = await db.pool.query(
			'SELECT idUser, name, surname, email, picture FROM user WHERE idUser IN(SELECT idUser FROM member WHERE idProject = ?)',
			[req.params.idProject]
		);
		let [roles] = await db.pool.query(
			'SELECT role,idUser FROM member WHERE idProject = ?',
			[req.params.idProject]
		);
		// Add Role property in users objects
		let member;
		users.forEach((user) => {
			user.role;
			// find user's role
			[member] = roles.filter((role) => {
				return role.idUser === user.idUser;
			});
			user.role = member.role;
			// delete user from roles list (makes next search easier)
			roles = roles.filter((role) => user.idUser != role.idUser);
		});
		res.status(200).send(users);
		return;
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
		return;
	}
}

async function members_delete(req, res) {
	let conn;
	try {
		if (req.body.idUser == null) {
			res.sendStatus(400);
			return;
		}
		// comment assignee member
		conn = await db.pool.getConnection();
		await conn.beginTransaction();
		conn.query(
			'UPDATE comment 				\
			SET idUser = 0 					\
			WHERE idUser = ? AND code IN (	\
				 SELECT code 				\
				 FROM issue 				\
				 WHERE idProject = ?)',
			[req.body.idUser, req.params.idProject]
		);
		conn.query(
			'DELETE \
			FROM assignee \
			WHERE idUser = ? AND code IN (\
				SELECT code \
				FROM issue \
				WHERE idProject = ?)',
			[req.body.idUser, req.params.idProject]
		);
		conn.query('DELETE FROM member WHERE idUser = ? AND idProject = ?', [
			req.body.idUser,
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
}

module.exports = {
	members_get,
	members_delete,
};
