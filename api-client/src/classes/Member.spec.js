const SagaClient = require('../index');
const Member = require('./Member');
const Project = require('./Project');

let client;
let member;
const MOCK_MEMBER = {
	idMember: 2,
	name: 'sdf',
	surname: 'asd',
	email: 'dj3j@jad.com',
	role: 'Admin',
	picture: '123',
};

beforeAll(() => {
	client = new SagaClient({ url: __MOCKURL__ });
});

test('constructs', () => {
	member = new Member(client, MOCK_MEMBER, 2);
	expect(member).toBeInstanceOf(Member);
});

test('id', () => {
	expect(member.id).toBe(MOCK_MEMBER.idMember);
});

test('toJSON', () => {
	let mem = member.toJSON();
	expect(mem).toBeTruthy();
	expect(() => {
		mem = JSON.parse(mem);
	}).not.toThrow();

	expect(mem).toMatchObject(MOCK_MEMBER);
});

test('get project', () => {
	expect(member.getProject()).toBeInstanceOf(Project);
});
