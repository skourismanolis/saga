const Joi = require('joi');
const c = require('./schemas_constants');

const schema = Joi.object().keys({
	idColumn: Joi.number().integer().min(c.MIN_ID).required(),
	name: Joi.string().min(c.MIN_STRING).required(),
	order: Joi.number().integer().min(0).required(),
});

module.exports = schema;
