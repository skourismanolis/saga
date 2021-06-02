const Joi = require('joi');
const c = require('./schemas_constants');

const schema = Joi.object().keys({
	idLabel: Joi.number().integer().min(c.MIN_ID).required(),
	name: Joi.string().min(c.MIN_STRING).max(c.MAX_STRING).required(),
	color: Joi.string()
		.length(c.COLOR_SIZE)
		.pattern(c.COLOR_PATTERN)
		.required(),
});

module.exports = schema;
