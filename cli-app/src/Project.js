const { Command } = require('commander');
const program = new Command();

const { client } = require('../index');

const project = program
	.command('project')
	.description('projects related supercommand');

project
	.command('get <idProject>')
	.description('get project by id')
	.action(async (idProject) => {
		try {
			let data = await client.getProject({ idProject });
			console.log(data);
		} catch (error) {
			if (error.response) console.error(error.response.statusText);
			else console.error(error);
		}
	});

project
	.command('create <title>')
	.description('create project')
	.action(async (title) => {
		try {
			if (title == null) {
				throw error;
			}
			let project = await client.createProject({ title });
			console.log(
				'Project created succesfully with idProject = "' +
					project.id +
					'"'
			);
		} catch (error) {
			if (error.response) console.error(error.response.statusText);
			else console.error(error);
		}
	});

project
	.command('update <idProject> <title>')
	.description('update project by id')
	.action(async (idProject, title) => {
		try {
			let project = await client.getProject({ idProject });
			await project.update({ title });
			console.log('Project updated successfully!');
		} catch (error) {
			if (error.response) console.error(error.response.statusText);
			else console.error(error);
		}
	});

project
	.command('delete <idProject>')
	.description('delete project by id')
	.action(async (idProject) => {
		try {
			let project = await client.getProject({ idProject });
			await client.deleteProject({ project });
			console.log('Deleted successfully!');
		} catch (error) {
			if (error.response) console.error(error.response.statusText);
			else console.error(error);
		}
	});

module.exports = {
	project,
};
