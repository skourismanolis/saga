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
				console.log(tokenRequest);
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
						default:
							console.log(
								'GET /token/<webToken> with unexpected process'
							);
							return res.sendStatus(403);
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
		let results = await db.query(
			`SELECT idUser FROM user WHERE idUser = ?;`,
			[tokenRequest.idUser]
		);
		if (results[0].length || tokenRequest.idUser == 0) {
			return res.sendStatus(404);
		}

		//update user
		results = await db.query(
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

module.exports = app;
