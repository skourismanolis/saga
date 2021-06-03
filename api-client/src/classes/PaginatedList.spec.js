const PaginatedList = require('./PaginatedList');
const SagaClient = require('../index');

let client;
let list;

const DATASIZE = 100;
const MOCKDATA = (() => {
	let a = [];
	for (let i = 0; i < DATASIZE; i++) {
		a.push('lorem');
	}
	return a;
})();

const transformer = jest.fn((data) => data);
const mockAxios = jest.fn((config) => {
	let limit = config.headers['X-Pagination-Limit'];
	let offset = config.headers['X-Pagination-Offset'];

	return {
		data: MOCKDATA.slice(offset, offset + limit),
		headers: {
			'x-pagination-total': MOCKDATA.length,
		},
	};
});

function testMockCallHeaderOffset(offset) {
	expect(mockAxios.mock.calls).toHaveLength(1);
	let headers = mockAxios.mock.calls[0][0].headers;
	expect(headers).toHaveProperty('X-Pagination-Offset');
	expect(headers['X-Pagination-Offset']).toBe(offset);
}

beforeAll(() => {
	client = new SagaClient({ url: __MOCKURL__ });
	client.axios = mockAxios;
});

test('constructor', () => {
	list = new PaginatedList(client, {
		url: '/projects',
		dataTransformer: transformer,
	});

	expect(list).toBeInstanceOf(PaginatedList);
});

test('refresh', async () => {
	await expect(list.refresh()).resolves.not.toThrow();
	expect(transformer.mock.calls).toHaveLength(1);
});

test('getters', () => {
	expect(list.content).toBeInstanceOf(Array);
	expect(list.content.length).toBeGreaterThan(0);
	let perPage = list.perPage;
	expect(perPage).toBeGreaterThan(0);
	expect(list.content).toHaveLength(perPage);
	expect(list.currentPage).toBe(0);
	let calculatedPages = Math.floor(DATASIZE / perPage);
	if (DATASIZE % perPage != 0) calculatedPages++;
	expect(list.pageCount).toBe(calculatedPages);
	expect(list.isLastPage).toBe(false);
	expect(list.total).toBe(DATASIZE);
});

test('setPerPage', async () => {
	await list.setPerPage(10);
	expect(list.content).toHaveLength(10);
	expect(list.perPage).toBe(10);
});

test('setPage', async () => {
	await list.setPerPage(10);
	mockAxios.mockClear();
	await list.setPage(1);
	testMockCallHeaderOffset(10);
	expect(list.currentPage).toBe(1);
});

test('setOffset', async () => {
	mockAxios.mockClear();
	await expect(list.setOffset(0)).resolves.not.toThrow();
	testMockCallHeaderOffset(0);
});

test('nextPage', async () => {
	await list.setPerPage(10);
	await list.setPage(0);
	mockAxios.mockClear();
	await expect(list.nextPage()).resolves.not.toThrow();
	expect(list._offset).toBe(10);
	expect(list.currentPage).toBe(1);
	testMockCallHeaderOffset(10);
});
