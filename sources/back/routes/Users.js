const express = require('express');
const app = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const email_validator = require('email-validator');
var nodemailer = require('nodemailer');

const db = require('../db').db;
const schemas = require('../schemas/schemas_export');

app.post('/login', async (req, res) => {
	try {
		Joi.attempt(req.body, schemas.UserLoginPost);
		// prettier-ignore
		const [result] = await db.pool.query(
			'SELECT * FROM user WHERE email = ?',
			[req.body.email]
		);
		if (result.length == 0) {
			return res.status(404).send('Not Found');
		}
		const users = result[0];
		if (await bcrypt.compare(req.body.password, users.password)) {
			const user = {
				id: users.id,
				plan: users.plan,
			};
			const accessToken = jwt.sign(
				user,
				process.env.ACCESS_TOKEN_SECRET,
				{
					expiresIn: '1w',
				}
			);
			res.status(200).send({ token: accessToken });
		} else {
			res.status(400).send('Invalid username or password');
		}
	} catch (err) {
		console.log(err);
		res.status(500).send('Internal Server Error');
	}
});

// register
app.post('/', async (req, res) => {
	try {
		Joi.attempt(req.body, schemas.UserPutPost);

		if (!email_validator.validate(req.body.email)) {
			throw new Error('Invalid email.');
		}
	} catch (error) {
		console.log(error);
		res.status(400).send('Bad request');
		return;
	}

	try {
		// prettier-ignore
		const [result] = await db.pool.query('SELECT * FROM user WHERE email = ?', [req.body.email]);
		if (result.length > 0) {
			throw new Error('Email exists');
		}
	} catch (err) {
		console.log(err);
		res.status(403).send('Forbidden');
		return;
	}

	try {
		const salt = await bcrypt.genSalt();

		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		await db.pool.query(
			'INSERT INTO user (username,email, password, name, surname, verified, plan , picture) VALUES (?,?,?,?,?,?,?,?)',
			[
				req.body.name + ' ' + req.body.surname,
				req.body.email,
				hashedPassword,
				req.body.name,
				req.body.surname,
				0,
				req.body.plan,
				req.body.picture,
			]
		);
		// prettier-ignore
		const [result] = await db.pool.query(
			'SELECT * FROM user WHERE email = ?',
			[req.body.email]
		);
		if (result.length == 0) {
			throw new Error('Not in db');
		}
		const emailToken = jwt.sign(
			{
				id: result[0].id,
			},
			process.env.EMAIL_SECRET
		);

		const url = `http://localhost:8080/token/${emailToken}`;

		var transporter = nodemailer.createTransport({
			service: 'gmail', // hostname
			auth: {
				user: 'mail',
				pass: 'pass',
			},
		});

		await transporter.sendMail({
			to: result[0].email,
			subject: 'Confirm Email for Saga Account',
			html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`,
		});

		res.status(200).send('Ok');
	} catch (err) {
		await db.pool.query('DELETE FROM user WHERE email = ?', [
			req.body.email,
		]);
		console.error(err);
		res.status(500).send('Internal Server Error');
	}
});

app.put('/', async (req, res) => {
	try {
		Joi.attempt(req.body, schemas.UserPutPost);
	} catch (error) {
		res.status(400).send('Bad request');
		return;
	}

	try {
		const salt = await bcrypt.genSalt();

		const [result] = await db.pool.query(
			'SELECT * FROM user WHERE id = ?',
			[req.user.id]
		);

		if (result.length == 0) {
			res.status(401).send('Unauthorized');
			return;
		}
		const verification = result[0].verification;
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		await db.pool.query(
			'UPDATE user SET username = ? ,email = ? , password = ? , name = ? , surname = ? , verified = ? , plan = ?  , picture = ?  WHERE id = ?',
			[
				req.body.username,
				req.body.email,
				hashedPassword,
				req.body.name,
				req.body.surname,
				verification,
				req.body.plan,
				req.body.picture,
				req.user.id,
			]
		);
		res.status(200).send('Ok');
	} catch (error) {
		res.status(500).send('Internal Server Error');
	}
});

module.exports = app;
