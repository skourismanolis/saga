const { connect, db } = require('../db');
const runQuery = require('./runQuery');
const supertest = require('supertest');
const app = require('../index');
const request = supertest(app);

module.exports = async function setup() {
	await connect();
	await runQuery(db.pool, [
		//remove all members
		'DELETE FROM member',
		//remove all sprints
		'UPDATE project SET activeSprint = NULL WHERE idProject > 0',
		'UPDATE issue SET idSprint = NULL',
		'DELETE FROM sprint',
		//remove all extra columns
		'UPDATE issue SET idColumn = NULL',
		'DELETE FROM `column` WHERE `order` > 2',
		//remove all epics
		'UPDATE issue SET idEpic = NULL',
		'DELETE FROM epic',
		//remove all labels
		'UPDATE issue SET idLabel = NULL',
		'DELETE FROM label WHERE idLabel > 0',
		//remove assignees
		'DELETE FROM assignee',
		//remove comments
		'DELETE FROM comment',
		//remove issues
		'DELETE FROM issue',
		//remove columns
		'DELETE FROM `column`',
		//remove projects
		'DELETE FROM project',
		//remove payments
		'DELETE FROM payment',
		//remove users
		'DELETE FROM user WHERE idUser > 0',
		//resetting auto increments
		'ALTER TABLE assignee AUTO_INCREMENT = 1',
		'ALTER TABLE `column` AUTO_INCREMENT = 1',
		'ALTER TABLE comment AUTO_INCREMENT = 1',
		'ALTER TABLE epic AUTO_INCREMENT = 1',
		'ALTER TABLE label AUTO_INCREMENT = 1',
		'ALTER TABLE member AUTO_INCREMENT = 1',
		'ALTER TABLE payment AUTO_INCREMENT = 1',
		'ALTER TABLE project AUTO_INCREMENT = 1',
		'ALTER TABLE sprint AUTO_INCREMENT = 1',
		'ALTER TABLE user AUTO_INCREMENT = 1',

		//starting values, order matters
		'INSERT INTO project (idProject, title, picture, activeSprint) VALUES (1,"asdasd", null, null)',
		'INSERT INTO project (idProject, title, picture, activeSprint) VALUES (2,"project2", null, null)',
		'ALTER TABLE project AUTO_INCREMENT = 3',
		'INSERT INTO label (idLabel,idProject,name,color) VALUES (1,1,"Frontend","#123456")',
		'INSERT INTO label (idLabel,idProject,name,color) VALUES (2,1,"CLI","#000000")',
		'INSERT INTO label (idLabel,idProject,name,color) VALUES (3,1,"Backend","#FF00FF")',
		'ALTER TABLE label AUTO_INCREMENT = 4',
		'INSERT INTO sprint (idSprint, idProject, title, deadline) VALUES (1,1,"sabsab","2023-07-07")',
		'INSERT INTO sprint (idSprint, idProject, title, deadline) VALUES (2,1,"sprint_2",null)',
		'INSERT INTO sprint (idSprint, idProject, title, deadline) VALUES (3,2,"sprint_1",null)',
		'ALTER TABLE sprint AUTO_INCREMENT = 4',
		'INSERT INTO `column`  (idProject, name, `order`) VALUES (1, "TO-DO", 1)',
		'INSERT INTO `column` (idProject, name, `order`) VALUES (1, "IN PROGRESS", 2)',
		'INSERT INTO `column`  (idProject, name, `order`) VALUES (2, "TO-DO", 1)',
		'INSERT INTO `column` (idProject, name, `order`) VALUES (2, "IN PROGRESS", 2)',
		'INSERT INTO `column` (idProject, name, `order`) VALUES (1,"Lorem",3)',
		'ALTER TABLE `column` AUTO_INCREMENT = 6',
		'INSERT INTO epic (idEpic, idProject, title, `start`, deadline, description) VALUES (1, 1, "test_epic", null,"2023-07-07", "test_description")',
		'INSERT INTO epic (idEpic, idProject, title, `start`, deadline, description) VALUES (2, 1, "test_epic_2", null,"2022-07-07", "test_description_2")',
		'INSERT INTO epic (idEpic, idProject, title, `start`, deadline, description) VALUES (3, 1, "mansd", null, null, "asd")',
		'ALTER TABLE epic AUTO_INCREMENT = 4',
		'INSERT INTO issue (code, idProject, title, category, points, priority, deadline, description, idLabel, idSprint, idColumn) VALUES ("ab",1,"test_title","Story","2","Low","2022-01-01","test",null,1,1)',
		'INSERT INTO issue (code, idProject, title, category, points, priority, deadline, description, idLabel, idSprint, idColumn) VALUES ("2F3D",1,"lorem","Task",12,"Neutral",null,"lorem ipsum dolor sit amet",1,2,2)',
		'INSERT INTO issue (code, idProject, title, category, points, priority, deadline, description, idLabel, idSprint, idColumn) VALUES ("issue1",2,"issue1","Task",2,"Low",null,"lorem ipsum dolor sit amet 11",null,3,1)',
		'INSERT INTO issue (code, idProject, title, category, points, priority, deadline, description, idLabel, idSprint, idColumn) VALUES ("issue2",2,"issue2","Story",98,"Very High",null,"lorem ipsum dolor sit amet 12",null,null,1)',
		'INSERT INTO issue (code, idProject, title, category, points, priority, deadline, description, idLabel, idSprint, idColumn) VALUES ("asdas",1,"asdas","Story",98,"Very High",null,"lorem ipsum dolor sit amet 11",null,null,1)',
		'INSERT INTO issue (code, idProject, title, category, points, priority, deadline, description, idLabel, idSprint, idColumn) VALUES ("aqwwsdas",1,"aqwwsdas","Task",2,"Low",null,"lorem ipsum dolor sit amet 12",null,null,1)',
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
		username: 'test_member_2',
		email: 'random_user@test.com',
		password: 'test_member',
		name: 'test_member_2',
		surname: 'test_member_2',
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

	await request.post('/users/').send({
		username: 'test_member',
		email: 'test_member_2@test.com',
		password: 'test_member_2',
		name: 'test_member',
		surname: 'test_member',
		plan: 'Free',
	});

	await runQuery(db.pool, [
		'UPDATE user SET verified=1 WHERE email="admin@admin.com"',
		'UPDATE user SET verified=1 WHERE email="test_member@test.com"',
		'UPDATE user SET verified=1 WHERE email="random_user@test.com"',
		'UPDATE user SET verified=1 WHERE email="test_member_2@test.com"',

		// 'INSERT INTO member (idUser,idProject,role) VALUES (1,2,"Admin")',
		'INSERT INTO member (idUser,idProject,role) VALUES (2,1,"Admin")',
		'INSERT INTO member (idUser,idProject,role) VALUES (3,1,"Member")',
		'INSERT INTO member (idUser,idProject,role) VALUES (4,1,"Member")',
		'INSERT INTO member (idUser,idProject,role) VALUES (2,2,"Admin")',

		'INSERT INTO assignee (code,idUser) VALUES ("2F3D",2)',
		'INSERT INTO assignee (code,idUser) VALUES ("2F3D",4)',
	]);
	await db.pool.end();
};
