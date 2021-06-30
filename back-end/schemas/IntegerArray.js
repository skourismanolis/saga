const Joi = require('joi');
const c = require('./schemas_constants');

const schema = Joi.array()
	.min(c.MIN_ID)
	.items(Joi.number().integer())
	.unique()
	.required();

module.exports = schema;
