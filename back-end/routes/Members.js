require('dotenv').config({
	path: process.env.NODE_ENV === 'test' ? '../.env.test' : '../.env',
});
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
		await conn.query(
			'UPDATE comment 				\
			SET idUser = 0 					\
			WHERE idUser = ? AND code IN (	\
				 SELECT code 				\
				 FROM issue 				\
				 WHERE idProject = ?)',
			[req.body.idUser, req.params.idProject]
		);
		await conn.query(
			'DELETE \
			FROM assignee \
			WHERE idUser = ? AND code IN (\
				SELECT code \
				FROM issue \
				WHERE idProject = ?)',
			[req.body.idUser, req.params.idProject]
		);
		await conn.query(
			'DELETE FROM member WHERE idUser = ? AND idProject = ?',
			[req.body.idUser, req.params.idProject]
		);
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

async function members_promote(req, res) {
	try {
		if (req.body.idUser == null) {
			res.sendStatus(400);
			return;
		}
		let [result] = await db.pool.query(
			'SELECT * FROM member WHERE idUser = ? AND idProject = ?',
			[req.body.idUser, req.params.idProject]
		);
		if (result.length == 0) {
			res.status(404).send({ message: 'Not a member' });
			return;
		}
		[result] = await db.pool.query(
			'SELECT * FROM member WHERE idUser = ? AND idProject = ? AND role = ?',
			[req.body.idUser, req.params.idProject, 'Admin']
		);
		if (result.length == 1) {
			res.sendStatus(200);
			return;
		}
		await db.pool.query(
			'UPDATE member SET role = ? WHERE idUser = ? AND idProject = ?',
			['Admin', req.body.idUser, req.params.idProject]
		);
		res.sendStatus(200);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
}

async function members_demote(req, res) {
	try {
		if (req.body.idUser == null) {
			res.sendStatus(400);
			return;
		}
		let [result] = await db.pool.query(
			'SELECT * FROM member WHERE idUser = ? AND idProject = ?',
			[req.body.idUser, req.params.idProject]
		);
		if (result.length == 0) {
			res.status(404).send({ message: 'Not a member' });
			return;
		}
		[result] = await db.pool.query(
			'SELECT * FROM member WHERE idProject = ? AND role = ?',
			[req.params.idProject, 'Admin']
		);
		if (result.length == 1) {
			res.sendStatus(400);
			return;
		}
		await db.pool.query(
			'UPDATE member SET role = ? WHERE idUser = ? AND idProject = ? AND role = ?',
			['Member', req.body.idUser, req.params.idProject, 'Admin']
		);
		res.sendStatus(200);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
}

module.exports = {
	members_get,
	members_delete,
	members_promote,
	members_demote,
};
