const port = 8080;
const express = require('express');
const app = express();
app.use(express.json());
var cors = require('cors');
app.use(cors());
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let { connect, db } = require('./db');

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
		if (err) return res.stats(403).send('Forbidden');
		req.user = user;
		next();
	});
});

app.get('/', async (req, res) => {
	// const [result] = await db.pool.query('SELECT * FROM user');
	res.status(200).send('Welcome to Saga');
});

app.post('/users/login', async (req, res) => {
	try {
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
		res.status(500).send('Internal Server Error');
	}
});

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
