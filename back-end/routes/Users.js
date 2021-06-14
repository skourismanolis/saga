require('dotenv').config({ path: '../.env' });
require('mysql2/promise');
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
	} catch (error) {
		console.log(error);
		res.status(400).send('Bad request');
		return;
	}
	try {
		// prettier-ignore
		const [result] = await db.pool.query(
			'SELECT * FROM user WHERE email = ?',
			[req.body.email]
		);
		if (result.length == 0) {
			return res.sendStatus(404);
		}
		const users = result[0];
		if (await bcrypt.compare(req.body.password, users.password)) {
			const user = {
				idUser: users.idUser,
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
			res.sendStatus(404);
		}
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
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
		if (process.env.NODE_ENV != 'test') {
			const emailToken = jwt.sign(
				{
					process: 'registration',
					idUser: result[0].idUser,
				},
				process.env.EMAIL_SECRET
			);

			const url = `http://localhost:8080/token/${emailToken}`;

			var transporter = nodemailer.createTransport({
				service: 'gmail', // hostname
				auth: {
					user: process.env.GMAIL_EMAIL,
					pass: process.env.GMAIL_PASS,
				},
			});

			await transporter.sendMail({
				to: result[0].email,
				subject: 'Confirm Email for Saga Account',
				html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`,
			});
		}

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
		// prettier-ignore
		const [result] = await db.pool.query('SELECT * FROM user WHERE idUser = ?', 
		[
			req.user.idUser,
		]);

		if (result.length == 0) {
			res.sendStatus(403);
			return;
		}
		// prettier-ignore
		if ( (await bcrypt.compare(req.body.password, result[0].password) ) == false ) {
			res.sendStatus(401);
			return;
		}
		await db.pool.query(
			'UPDATE user SET username = ? ,email = ? , name = ? , surname = ? , plan = ?  , picture = ?  WHERE idUser = ?',
			[
				req.body.username,
				req.body.email,
				req.body.name,
				req.body.surname,
				req.body.plan,
				req.body.picture,
				req.user.idUser,
			]
		);
		res.status(200).send('Ok');
	} catch (error) {
		res.status(500).send('Internal Server Error');
	}
});

app.delete('/', async (req, res) => {
	let conn;
	try {
		const [result] = await db.pool.query(
			'SELECT * FROM user WHERE idUser = ?',
			[req.user.idUser]
		);
		if (result.length == 0) {
			res.status(400).send('Bad request');
			return;
		}
		if (req.body.password == null) {
			res.sendStatus(400);
			return;
		}
		// prettier-ignore
		if ( (await bcrypt.compare(req.body.password, result[0].password) ) == false ) {
			res.status(401).send('Unauthorized');
			return;
		}
		const [admin] = await db.pool.query(
			'SELECT * FROM member WHERE idUser = ? AND role = ?',
			[req.user.idUser, 'Admin']
		);
		if (admin.length > 0) {
			res.status(403).send('Admin');
			return;
		}
		conn = await db.pool.getConnection();
		await conn.beginTransaction();
		await conn.query('DELETE FROM assignee WHERE idUser = ?', [
			req.user.idUser,
		]);
		await conn.query('DELETE FROM payment WHERE idUser = ?', [
			req.user.idUser,
		]);
		await conn.query('DELETE FROM member WHERE idUser = ?', [
			req.user.idUser,
		]);
		await conn.query('DELETE FROM user WHERE idUser = ?', [
			req.user.idUser,
		]);

		await conn.commit();
		res.status(200).send('Ok');
	} catch (error) {
		if (conn != null) conn.rollback();
		res.status(500).send('Internal Server Error');
	} finally {
		if (conn != null) conn.release();
	}
});

module.exports = app;
