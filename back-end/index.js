require('dotenv').config();

const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
const jwt = require('jsonwebtoken');

app.use('/', (req, res, next) => {
	const header = req.get('authorization');
	const token = header && header.split(' ')[1];
	if (token == null) {
		req.user = {
			id: -1,
			plan: 'none',
		};
		next();
		return;
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.status(403).send('Forbidden');
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
