const SagaClient = require('../index');
const Label = require('./Label');

let client;
let label;
beforeAll(() => {
	client = new SagaClient({ url: __MOCKURL__ });
});

it('constructs', async () => {
	label = new Label(
		client,
		{
			idLabel: 2,
			name: 'Frontend',
			color: '#123456',
		},
		2
	);
	expect(label).toBeTruthy();
});

it('updates', async () => {
	await expect(label.update({ title: 'asdsad' })).resolves.not.toThrow();
});
