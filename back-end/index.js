require('dotenv').config({
	path: process.env.NODE_ENV === 'test' ? './.env.test' : './.env',
});

const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
const jwt = require('jsonwebtoken');

var corsOptions = {
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	allowedHeaders: [
		'X-Pagination-Limit',
		'X-Pagination-Offset',
		'Authorization',
	],
	exposedHeaders: ['X-Pagination-Total'],
};

app.use(cors(corsOptions));

app.use('/', (req, res, next) => {
	const header = req.get('authorization');
	const token = header && header.split(' ')[1];
	if (token == null) {
		req.user = {
			idUser: -1,
			plan: 'none',
		};
		next();
		return;
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(401);
		req.user = user;
		next();
	});
});

app.get('/', async (req, res) => {
	res.status(200).send('Welcome to Saga');
});

app.use('/users', require('./routes/Users'));
app.use('/token', require('./routes/Token'));
app.use('/projects', require('./routes/Projects'));

module.exports = app;
