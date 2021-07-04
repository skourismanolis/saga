const { connect, db } = require('../db');
const runQuery = require('./runQuery');
const supertest = require('supertest');
const app = require('../index');
const request = supertest(app);

module.exports = async function setup() {
	await connect();
	await runQuery(db.pool, [
		'DELETE FROM member WHERE idProject = 2',
		'UPDATE project SET activeSprint = NULL WHERE idProject > 0',
		'DELETE FROM sprint WHERE idSprint > 0',
		'ALTER TABLE sprint AUTO_INCREMENT = 1',
		'DELETE FROM `column` WHERE idColumn > 0',
		'ALTER TABLE `column` AUTO_INCREMENT = 1',
		'DELETE FROM epic WHERE idEpic > 0',
		'ALTER TABLE epic AUTO_INCREMENT = 1',
		'DELETE FROM project WHERE idProject > 0',
		'ALTER TABLE project AUTO_INCREMENT = 1',
		'DELETE FROM user WHERE idUser > 0',
		'ALTER TABLE user AUTO_INCREMENT = 1',
		'DELETE FROM label WHERE idLabel > 0',
		'ALTER TABLE label AUTO_INCREMENT = 1',
		'INSERT INTO project (idProject, title, picture, activeSprint) VALUES (2,"asdasd", null, null)',
		'INSERT INTO label (idLabel,idProject,name,color) VALUES (1,2,"Frontend","#123456")',
		'INSERT INTO sprint (idSprint, idProject, title, deadline) VALUES (1,2,"sabsab","2023-07-07")',
		'INSERT INTO `column`  (idProject, name, `order`) VALUES (2, "TO-DO", 1)',
		'INSERT INTO `column` (idProject, name, `order`) VALUES (2, "IN PROGRESS", 2)',
		'INSERT INTO epic (idEpic, idProject, title, `start`, deadline, description) VALUES (1, 2, "test_epic", null,"2023-07-07", "test_description")',
		'INSERT INTO issue (code, idProject, title, category, points, priority, deadline, description, idLabel, idSprint) VALUES ("ab",2,"test_title","Story","2","Low","2022-01-01","test",null,1)',
	]);
	await request.post('/users/').send({
		username: 'admin',
		email: 'admin@admin.com',
		password: 'admin',
		name: 'string',
		surname: 'string',
		plan: 'Free',
	});

	await request.post('/users/').send({
		username: 'test_member',
		email: 'test_member@test.com',
		password: 'test_member',
		name: 'test_member',
		surname: 'test_member',
		plan: 'Free',
	});

	await runQuery(db.pool, [
		'UPDATE user SET verified=1 WHERE email="admin@admin.com"',
		'UPDATE user SET verified=1 WHERE email="test_member@test.com"',
		'INSERT INTO member (idUser,idProject,role) VALUES (1,2,"Admin")',
		'INSERT INTO member (idUser,idProject,role) VALUES (2,2,"Member")',
	]);
	await db.pool.end();
};
