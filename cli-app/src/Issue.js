const { Command } = require('commander');
const program = new Command();

const { client } = require('../index');

const issue = program
	.command('issue')
	.description('issues related supercommand');

issue
	.command('get <idProject> <code>')
	.description('get details of issue in project with code')
	.action(async (idProject, code) => {
		try {
			let issue = await client.getProjectIssue({ idProject, code });
			console.log(issue.toJSON());
		} catch (error) {
			// console.log(error);
			if (error.response) console.error(error.response.statusText);
			else console.error(error);
		}
	});

issue
	.command(
		'update <idProject> <code> <title> <category> <points> <priority> <description> <deadline> <label> <idColumn> <assignees...>'
	)
	.description('update issue in project with code')
	.action(
		async (
			idProject,
			code,
			title,
			category,
			points,
			priority,
			description,
			deadline,
			label,
			idColumn,
			assignees
		) => {
			try {
				if (points == 'null') points = null;
				if (description == 'null') description = null;
				if (deadline == 'null') deadline = null;
				if (label == 'null') label = null;
				if (idColumn == 'null') idColumn = null;
				if (assignees[0] == 'null') assignees = null;
				let myissue = await client.getProjectIssue({ idProject, code });
				await myissue.update({
					title,
					category,
					points,
					priority,
					description,
					deadline,
					label,
					idColumn,
					assignees,
				});
				console.log('Updated successfully!');
				console.log(myissue.toJSON());
			} catch (error) {
				if (error.response) console.error(error.response.statusText);
				else console.error(error);
			}
		}
	);

// issue
// 	.command('update <username> <email> <password> <name> <surname> <plan>')
// 	.description('update this user profile')
// 	.action(async (username, email, password, name, surname, plan) => {
// 		try {
// 			await client.userEdit({
// 				username,
// 				email,
// 				password,
// 				name,
// 				surname,
// 				plan,
// 			});
// 			console.log('User updated successfully!');
// 		} catch (error) {
// 			if (error.response) console.error(error.response.statusText);
// 			else console.error(error);
// 		}
// 	});

// issue
// 	.command('get')
// 	.description('update this user profile')
// 	.action(async () => {
// 		try {
// 			let data = await client.getProfile();
// 			console.log(data);
// 		} catch (error) {
// 			if (error.response) console.error(error.response.data);
// 			else console.error(error);
// 		}
// 	});

module.exports = {
	issue,
};
