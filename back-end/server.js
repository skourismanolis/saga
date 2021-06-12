const connect = require('./db').connect;
const app = require('./index');

const port = 8080;

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
