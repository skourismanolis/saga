const Joi = require('joi');
const c = require('./schemas_constants');

const schema = Joi.object().keys({
	username: Joi.string().min(c.MIN_STRING).max(c.MAX_STRING).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(c.MIN_PASSWORD).max(c.MAX_PASSWORD).required(),
	name: Joi.string().min(c.MIN_STRING).max(c.MAX_STRING).required(),
	surname: Joi.string().min(c.MIN_STRING).max(c.MAX_STRING).required(),
	birthDate: Joi.date().required(),
	plan: Joi.string().valid('Free', 'Premium', 'Host').required(),
	profession: Joi.string()
		.min(c.MIN_STRING)
		.max(c.MAX_STRING)
		.required()
		.allow(null),
	picture: Joi.string()
		.min(c.MIN_STRING)
		.max(c.MAX_STRING)
		.required()
		.allow(null),
	studies: Joi.string()
		.min(c.MIN_STRING)
		.max(c.MAX_STRING)
		.required()
		.allow(null),
	residence: Joi.string()
		.min(c.MIN_STRING)
		.max(c.MAX_STRING)
		.required()
		.allow(null),
});

module.exports = schema;
