const client = require('./index');

describe('constructs correctly', () => {
	test('correct baseURL', () => {
		let c = new client({ url: 'test' });
		expect(c.ax.defaults.baseURL).toBe('test');
	});
});
