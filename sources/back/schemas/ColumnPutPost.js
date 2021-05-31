const Joi = require('joi');
const c = require('./schemas_constants');

const schema = Joi.object().keys({
	name: Joi.string().min(c.MIN_STRING).max(c.MAX_STRING).required(),
	order: Joi.number().integer().min(0).required(),
});

module.exports = schema;
