const SagaClient = require('@dira/api-client');
const Member = require('@dira/api-client/src/classes/Member');
const Project = require('@dira/api-client/src/classes/Project');

let client;
let member;
const MOCK_MEMBER = {
	idUser: 2,
	// username: 'test_member_2',
	name: 'test_member_2',
	surname: 'test_member_2',
	email: 'random_user@test.com',
	role: 'Admin',
	// password: 'test_member',
	picture: null,
	// plan: 'Free',
};

const MOCKPROJECT = {
	idProject: 1,
	title: 'asdasd',
	picture: null,
};

beforeAll(async () => {
	client = new SagaClient({ url: __APIURL__ });
	if (__TEST_MODE__ === 'REST') {
		await client.login({
			email: 'random_user@test.com',
			password: 'test_member',
		});
	}
});

test('constructs', () => {
	member = new Member(client, MOCK_MEMBER, 1);
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
	if (__TEST_MODE__ === 'CLIENT') {
		let mockAxios = { get: jest.fn(async () => ({ data: [MOCKPROJECT] })) };
		member.axios = mockAxios;
		await expect(member.getProject()).resolves.toBeInstanceOf(Project);
		member.axios = client.axios;
	} else if (__TEST_MODE__ === 'REST') {
		await expect(member.getProject()).resolves.toBeInstanceOf(Project);
	}
});

test('refresh', async () => {
	if (__TEST_MODE__ === 'CLIENT') {
		let mockAxios = { get: jest.fn(async () => ({ data: [MOCK_MEMBER] })) };
		member.axios = mockAxios;
		await expect(member.refresh()).resolves.not.toThrow();
	} else if (__TEST_MODE__ === 'REST') {
		await expect(member.refresh()).resolves.not.toThrow();
	}
});
