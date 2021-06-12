const SagaClient = require('../index');
const Member = require('./Member');
const Project = require('./Project');

let client;
let member;
const MOCK_MEMBER = {
	idUser: 2,
	name: 'sdf',
	surname: 'asd',
	email: 'dj3j@jad.com',
	role: 'Admin',
	picture: '123',
};

const MOCKPROJECT = {
	idProject: 2,
	title: 'asdasd',
	picture: null,
};

beforeAll(() => {
	client = new SagaClient({ url: __MOCKURL__ });
});

test('constructs', () => {
	member = new Member(client, MOCK_MEMBER, 2);
	expect(member).toBeInstanceOf(Member);
});

test('id', () => {
	expect(member.id).toBe(MOCK_MEMBER.idUser);
});

test('toJSON', () => {
	let mem = member.toJSON();
	expect(mem).toBeTruthy();
	expect(() => {
		mem = JSON.parse(mem);
	}).not.toThrow();

	expect(mem).toMatchObject(MOCK_MEMBER);
});

test('get project', async () => {
	let mockAxios = { get: jest.fn(async () => ({ data: [MOCKPROJECT] })) };
	member.axios = mockAxios;
	await expect(member.getProject()).resolves.toBeInstanceOf(Project);
	member.axios = client.axios;
});

test('refresh', async () => {
	let mockAxios = { get: jest.fn(async () => ({ data: [MOCK_MEMBER] })) };
	member.axios = mockAxios;
	await expect(member.refresh()).resolves.not.toThrow();
});
