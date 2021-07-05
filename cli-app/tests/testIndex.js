let path = require('path');
let exec = require('child_process').exec;

function cli(args, cwd) {
	return new Promise((resolve) => {
		let mycommand = `node ${path.resolve('./index')} ${args.join(' ')}`;
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
