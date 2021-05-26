const SagaClient = require('../index');
const Project = require('./Project');

const MOCK_PROJECT = {
	idProject: 123,
	name: 'test',
	members: [
		{
			name: 'a',
			surname: 'o',
			admin: false,
			picture: null,
		},
		{
			name: 'e',
			surname: 'i',
			admin: true,
			picture: 'https://google.com',
		},
	],
};

let project;

beforeAll(() => {
	let client = new SagaClient({ url: __MOCKURL__ });
	project = new Project(client, MOCK_PROJECT);
});

test('project constructor', () => {
	expect(project.id).toBe(MOCK_PROJECT.idProject);
});

describe('members', () => {
	it('has 2 members', () => {
		expect(project.members).toHaveLength(2);
	});

	it('has one non-admin', () => {
		let nonAdmins = project.nonAdmins;
		expect(nonAdmins).toHaveLength(1);
		expect(nonAdmins[0]).toEqual(MOCK_PROJECT.members[0]);
	});

	it('has one admin', () => {
		let admins = project.admins;
		expect(admins).toHaveLength(1);
		expect(admins[0]).toEqual(MOCK_PROJECT.members[1]);
	});

	test('members equal admins and non-admins', () => {
		let members = project.members;
		let nonAdmins = project.nonAdmins;
		let admins = project.admins;
		expect(members).toEqual([...nonAdmins, ...admins]);
	});
});
