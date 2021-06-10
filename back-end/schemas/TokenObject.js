const Joi = require('joi');
const c = require('./schemas_constants');

const schema = Joi.object()
	.unknown('allow')
	.keys({
		process: Joi.string()
			.valid('forgot', 'registration', 'invite')
			.required(),
		idUser: Joi.number().integer().min(c.MIN_ID),
		idProject: Joi.number().integer().min(c.MIN_ID),
	});

module.exports = schema;
