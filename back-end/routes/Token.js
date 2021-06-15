const express = require('express');
const app = express.Router();
const Joi = require('joi');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');

const db = require('../db').db;
const schemas = require('../schemas/schemas_export');

app.get('/:token', async (req, res) => {
	try {
		let token = req.params.token;
		jwt.verify(
			token,
			process.env.EMAIL_SECRET,
			async (err, tokenRequest) => {
				if (err) return res.sendStatus(400);
				try {
					Joi.attempt(tokenRequest, schemas.TokenObject);

					switch (tokenRequest.process) {
						case 'forgot':
							//TODO
							break;
						case 'registration':
							await registration(req, res, tokenRequest);
							break;
						case 'invite':
							await invite(req, res, tokenRequest);
							break;
					}
				} catch (error) {
					console.log(error);
					return res.sendStatus(400);
				}
			}
		);
	} catch (error) {
		res.sendStatus(500);
		console.error(error);
	}
});

async function registration(req, res, tokenRequest) {
	try {
		//if user does not exist return 404 non found
		let results = await db.pool.query(
			`SELECT idUser FROM user WHERE idUser = ?;`,
			[tokenRequest.idUser]
		);
		if (results[0].length == 0) {
			return res.sendStatus(404);
		}

		//update user
		results = await db.pool.query(
			`UPDATE user SET verified = 1 WHERE idUser = ?;`,
			[tokenRequest.idUser]
		);

		//OK
		return res.sendStatus(200);
	} catch (error) {
		res.sendStatus(500);
		console.error(error);
	}
}

async function invite(req, res, tokenRequest) {
	try {
		//if not logged in, return 401 unauthorized
		if (req.user.idUser == -1) return res.sendStatus(401);

		//if project doesn't exist, return 404 non found
		let results = await db.pool.query(
			`SELECT idProject FROM project WHERE idProject = ?;`,
			[tokenRequest.idProject]
		);
		if (results[0].length == 0) {
			return res.sendStatus(404);
		}

		//if user doesn't exist (eg. recently deleted user), return 403 forbidden
		results = await db.pool.query(
			`SELECT idUser  FROM user  WHERE idUser = ?;`,
			[req.user.idUser]
		);
		if (results[0].length == 0) {
			return res.sendStatus(403);
		}

		results = await db.pool.query(
			'SELECT idUser FROM member WHERE idUser = ? AND idProject = ?',
			[req.user.idUser, tokenRequest.idProject]
		);
		if (results[0].length > 0) {
			return res.sendStatus(400);
		}
		//insert new member
		results = await db.pool.query(
			`INSERT INTO member
			VALUES (?, ?, 'Member');`,
			[req.user.idUser, tokenRequest.idProject]
		);

		//OK
		return res.sendStatus(200);
	} catch (error) {
		res.sendStatus(500);
		console.error(error);
	}
}

module.exports = app;
