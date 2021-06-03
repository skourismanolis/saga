require('dotenv').config();

const port = 8080;
const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
const jwt = require('jsonwebtoken');

// const { connect, db } = require('./db');
const connect = require('./db').connect;

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
	// const [result] = await db.pool.query('SELECT * FROM user');
	res.status(200).send('Welcome to Saga');
});

app.use('/users', require('./routes/Users'));
app.use('/token', require('./routes/Token'));

async function main() {
	try {
		await connect();
	} catch (error) {
		console.error(error);
		return;
	}
	app.listen(port, () =>
		console.log(`App listening at http://localhost:${port}`)
	);
}

main();
