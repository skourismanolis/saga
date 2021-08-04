require('dotenv').config({
	path: process.env.NODE_ENV === 'test' ? '../.env.test' : '../.env',
});
const express = require('express');
const app = express.Router();
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const email_validator = require('email-validator');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const schemas = require('../schemas/schemas_export');

const usersModel = require('../model/UsersModel');

app.post('/login', async (req, res) => {
	try {
		Joi.attempt(req.body, schemas.UserLoginPost);
	} catch (error) {
		console.error(error);
		res.status(400).send('Bad request');
		return;
	}
	try {
        users = await usersModel.getUser({email: req.body.email});

		if (users.error == 2) 
			return res.sendStatus(404);
        else if (users.error == 1) throw 500;
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
		console.error(err);
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
		console.error(error);
		res.status(400).send('Bad request');
		return;
	}

	try {
        result = await getUser({email:req.body.email});
		if (result.error) {
			throw new Error('Email exists');
		}
	} catch (err) {
		console.error(err);
		res.status(403).send('Forbidden');
		return;
	}

	try {
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		if (req.body.username == null)
			req.body.username = (
				req.body.name +
				' ' +
				req.body.surname
			).substring(0, 45);
        
        result = await createUser({username:req.body.username, email:req.body.email, hashedPassword:hashedPassword, name:req.body.name, surname:req.body.surname, verified:0, plan:req.body.plan, picture:null})
        if(result.error) throw 500

        result = await getUser({email:req.body.email});
		if (result.error) {
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

			const url =
				req.protocol + '://' + req.get('host') + `/token/${emailToken}`;

			var transporter = nodemailer.createTransport({
				host: 'mail.gmx.com',
				port: 465,
				auth: {
					user: process.env.GMAIL_EMAIL,
					pass: process.env.GMAIL_PASS,
				},
			});

			await transporter.sendMail({
				from: process.env.GMAIL_EMAIL,
				to: result[0].email,
				subject: 'Confirm Email for Saga Account',
				html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`,
			});
		}

		res.status(200).send('Ok');
	} catch (err) {
        // TODO
		await usersModel.deleteUser({email: req.body.email});
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
		let [result] = await getUser({idUser: req.user.idUser});

		if (result.error) {
			res.sendStatus(403);
			return;
		}
		// prettier-ignore
		if ( (await bcrypt.compare(req.body.password, result.password) ) == false ) {
			res.sendStatus(403);
			return;
		}

		if (req.body.username == null)
			req.body.username = (
				req.body.name +
				' ' +
				req.body.surname
			).substring(0, 45);

		result = await usersModel.updateUser({
            username: req.body.username,
            email: req.body.email,
            name: req.body.name,
            surname: req.body.surname,
            plan: req.body.plan,
            idUser: req.user.idUser});
        if(result.error) throw 500
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
			res.sendStatus(403);
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
		await conn.query('UPDATE comment SET idUser = ? WHERE idUser = ?', [
			0,
			req.user.idUser,
		]);
		// await conn.query('DELETE FROM payment WHERE idUser = ?', [
		// 	req.user.idUser,
		// ]);
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

app.get('/:idUser', async (req, res) => {
	try {
		let [result] = await db.pool.query(
			'SELECT idUser FROM user WHERE idUser = ?',
			[req.params.idUser]
		);
		if (result.length == 0) {
			res.sendStatus(404);
			return;
		}
		[result] = await db.pool.query(
			'SELECT idUser FROM member WHERE idUser = ? AND idProject IN (SELECT idProject FROM member WHERE idUser = ?)',
			[req.params.idUser, req.user.idUser]
		);
		if (result.length == 0 && req.params.idUser != req.user.idUser) {
			res.sendStatus(403);
			return;
		}
		[result] = await db.pool.query(
			'SELECT idUser,name,surname,email,picture,username,plan FROM user WHERE idUser = ?',
			[req.params.idUser]
		);

		if (result[0].picture != null) {
			result[0].picture =
				req.protocol +
				'://' +
				req.get('host') +
				'/profilePics/' +
				result[0].picture;
		}

		if (req.params.idUser != req.user.idUser) {
			delete result[0]['plan'];
		}
		res.status(200).send(result[0]);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
});

app.put('/picture', upload.single('picture'), async (req, res) => {
	try {
		let [result] = await db.pool.query(
			'UPDATE user SET picture = ? WHERE idUser = ?',
			[req.file != undefined ? req.file.filename : null, req.user.idUser]
		);
		if (result.length == 0) {
			res.sendStatus(403);
			throw c.INVALID_TRANSACTION;
		}
		res.sendStatus(200);
	} catch (error) {
		if (error != c.INVALID_TRANSACTION) {
			console.error(error);
			res.sendStatus(500);
		}
		return;
	}
});

module.exports = app;
