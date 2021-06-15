const { db } = require('./db');

// example call for Project_auth

// member auth
// get app.get('/projects/{{idProject}}',    Project_auth({{idProject}},[Member]),	            async (req, res) => {}

// admin auth
// get app.get('/projects/{{idProject}}',    Project_auth({{idProject}},['Member','Admin']),	async (req, res) => {}
function Project_auth(roles) {
	return async function (req, res, next) {
		try {
			// prettier-ignore
			const [result] = await db.pool.query(
				'SELECT role FROM member WHERE idUser = ? AND idProject = ?',
				[req.user.idUser, req.params.idProject]
				);
			if (result.length == 0) {
				res.sendStatus(404);
				return;
			}
			if (roles.indexOf(result[0].role) < 0) {
				res.sendStatus(403);
				return;
			}
			next();
		} catch (err) {
			console.error(err);
			res.sendStatus(500);
			return;
		}
	};
}

module.exports = {
	Project_auth,
};
