const { cli } = require('./testIndex');
const SagaClient = require('@dira/api-client');
const keytar = require('keytar');

let client = new SagaClient({ url: __APIURL__ }); //TODO only keep decleration
const user = {
	username: 'test_member_2',
	email: 'random_user@test.com',
	password: 'test_member',
	name: 'test_member_2',
	surname: 'test_member_2',
	plan: 'Free',
	accountName: 'tralala',
};

let project;
beforeAll(async () => {
	client = new SagaClient({ url: __APIURL__ });
	await client.login({ email: user.email, password: user.password });
	await keytar.setPassword('Saga', user.accountName, client.token);
});

describe('basic project interactions', () => {
	it('creates a Project', async () => {
		let result = await cli(
			['-a', user.accountName, 'project', 'create', 'Project_Title'],
			'.'
		);
		const regex = /idProject = "([\S]*)"/g;
		let idProject = regex.exec(result.stdout)[1];
		project = await client.getProject({ idProject });
		expect(project.id).toBe(idProject);
	});

	it('get a Project by id', async () => {
		let result = await cli(
			['-a', user.accountName, 'project', 'get', project.id],
			'.'
		);
		const regex = /title: '([\S]*)'/g;
		let title = regex.exec(result.stdout)[1];
		expect(project.title).toBe(title);
	});

	it('update a Project', async () => {
		let result = await cli(
			[
				'-a',
				user.accountName,
				'project',
				'update',
				project.id,
				'newTitle',
			],
			'.'
		);
		expect(result.code).toBe(0);
		project = await client.getProject({ idProject: project.id });
		expect(project.title).toBe('newTitle');
	});

	it('delete a Project', async () => {
		await cli(
			['-a', user.accountName, 'project', 'delete', project.id],
			'.'
		);
		await expect(
			client.getProject({ idProject: project.id })
		).rejects.toThrow();
	});
});
