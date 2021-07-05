let path = require('path');
let exec = require('child_process').exec;

function cli(args, cwd) {
	return new Promise((resolve) => {
		let my_path = path.resolve('./index').normalize();
		// my_path = my_path.replace(/\\\\/g, '/');
		let mycommand = `node ./index ${args.join(' ')}`;
		exec(mycommand, { cwd }, (error, stdout, stderr) => {
			resolve({
				code: error && error.code ? error.code : 0,
				error,
				stdout,
				stderr,
			});
		});
	});
}

module.exports = {
	cli,
};
