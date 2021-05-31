const Joi = require('joi');
const c = require('./schemas_constants');

const schema = Joi.object().keys({
	idColumn: Joi.number().required().integer().min(c.MIN_ID),
	name: Joi.string().required().min(c.MIN_STRING),
	order: Joi.number().required().integer().min(0),
});

module.exports = schema;
