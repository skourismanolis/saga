const Joi = require('joi');
const c = require('./schemas_constants');

const schema = Joi.object().keys({
	username: Joi.string()
		.min(c.MIN_STRING)
		.max(c.MAX_STRING)
		.required()
		.allow(null),
	email: Joi.string().email().required(),
	password: Joi.string().min(c.MIN_PASSWORD).max(c.MAX_PASSWORD).required(),
	name: Joi.string().min(c.MIN_STRING).max(c.MAX_STRING).required(),
	surname: Joi.string().min(c.MIN_STRING).max(c.MAX_STRING).required(),
	plan: Joi.string().valid('Free', 'Premium', 'Host').required(),
});

module.exports = schema;
