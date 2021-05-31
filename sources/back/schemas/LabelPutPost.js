const Joi = require('joi');
const c = require('./schemas_constants');

const schema = Joi.object().keys({
	name: Joi.string().required().min(c.MIN_STRING),
	color: Joi.string()
		.length(c.COLOR_SIZE)
		.pattern(c.COLOR_PATTERN)
		.required(),
});

module.exports = schema;
