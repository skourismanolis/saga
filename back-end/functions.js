const { db } = require('./db');

// example call for Project_auth

// member auth
// get app.get('/projects/{{idProject}}',    Project_auth({{idProject}},[Member]),	            async (req, res) => {}

// admin auth
// get app.get('/projects/{{idProject}}',    Project_auth({{idProject}},['Member','Admin']),	async (req, res) => {}
function Project_auth(roles) {
	return function (req, res, next) {
		try {
			// prettier-ignore
			const [result] = db.pool.query(
				'SELECT role FROM member WHERE idUser = ? AND idProject = ?',
				[req.user.id, req.params.idProject]
			);
			if (result.length == 0) {
				throw new Error('No such member');
			}
			if (roles.indexOf(result[0]) < 0) {
				throw new Error('Forbidden');
			}
			next();
		} catch (err) {
			res.sendStatus(403);
			return;
		}
	};
}

module.exports = {
	Project_auth,
};
