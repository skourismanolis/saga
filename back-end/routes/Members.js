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
		let [result] = await db.pool.query(
			'SELECT * FROM project WHERE idProject = ?',
			[req.params.idProject]
		);
		if (result.length == 0) {
			res.sendStatus(404);
			return;
		}
		[result] = await db.pool.query(
			'SELECT * FROM member WHERE idUser = ? AND idProject = ?',
			[req.user.idUser, req.params.idProject]
		);
		if (result.length == 0) {
			res.sendStatus(403);
			return;
		}
		let [users] = await db.pool.query(
			'SELECT idUser, name, surname, email, picture FROM user WHERE idUser IN(SELECT idUser FROM member WHERE idProject = ?)',
			[req.params.idProject]
		);
		let [roles] = await db.pool.query(
			'SELECT role,idUser FROM member WHERE idProject = ?',
			[req.params.idProject]
		);
		let member;
		users.forEach((user) => {
			member = roles.filter((role) => {
				return role.idUser === user.idUser;
			});
			user.role = member.role;
			roles = roles.filter((role) => role.idUser != role.idUser);
		});
		res.status(200).send(users);
		return;
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
		return;
	}
}

module.exports = {
	members_get,
};
