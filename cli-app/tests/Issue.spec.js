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
	project = await client.createProject({ title: 'lol' });
});

describe('basic issue interactions', () => {
	it('creates an issue', async () => {
		let result = await cli(
			[
				'-a',
				user.accountName,
				'issue',
				'create',
				project.id,
				'user.password',
				'Task',
				'null',
				'Low',
				'user.plan',
				'null',
				'null',
				['null'],
			],
			'.'
		);
		const regex = /_code: '([\S]*)'/g;
		let new_code = regex.exec(result.stdout)[1];
		let { code } = await project.getIssue(new_code);
		expect(code).toBe(new_code);
	});

	it('updates an issue', async () => {
		let { content } = await project.searchIssues({});
		await cli(
			[
				'-a',
				user.accountName,
				'issue',
				'update',
				project.id,
				content[0].id,
				'New_Title',
				'Task',
				'null',
				'Low',
				'user.plan',
				'null',
				'null',
				'null',
				['null'],
			],
			'.'
		);
		// await project.refresh();
		let issue = await project.getIssue(content[0].id);
		expect(issue.title).toBe('New_Title');
	});

	it('get an issue', async () => {
		let { content } = await project.searchIssues({});
		let result = await cli(
			['-a', user.accountName, 'issue', 'get', project.id, content[0].id],
			'.'
		);
		const regex = /"title": "([\S]*)"/g;
		let title = regex.exec(result.stdout)[1];
		expect(title).toBe(content[0].title);
	});

	it('delete an issue', async () => {
		let { content } = await project.searchIssues({});
		await cli(
			[
				'-a',
				user.accountName,
				'issue',
				'delete',
				project.id,
				content[0].id,
			],
			'.'
		);
		let old_content = content;
		// let new_issues.content =  await project.searchIssues({});
		expect(old_content.length).toBeGreaterThan(
			(await project.searchIssues({})).content.length
		);
	});
});
