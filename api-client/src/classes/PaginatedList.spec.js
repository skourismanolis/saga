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
	let calculatedPages = DATASIZE / perPage;
	if (DATASIZE % perPage != 0) calculatedPages++;
	expect(list.pageCount).toBe(calculatedPages);
	expect(list.isLastPage).toBe(false);
	expect(list.total).toBe(DATASIZE);
});
