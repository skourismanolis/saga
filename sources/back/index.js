const port = 8080;
const express = require('express');
const app = express();
app.use(express.json());
var cors = require('cors');
app.use(cors());

let { connect, db } = require('./db');

app.listen(port, () =>
	console.log(`App listening at http://localhost:${port}`)
);

app.get('/', async (req, res) => {
	// const [result] = await db.pool.query('SELECT * FROM user');
	res.status(200).send('Welcome to Saga');
});

async function main() {
	try {
		await connect();
	} catch (error) {
		console.error(error);
		return;
	}
}

main();
