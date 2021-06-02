const Joi = require('joi');
const c = require('./schemas_constants');

const schema = Joi.object().keys({
	email: Joi.string().email().required(),
	password: Joi.string().min(c.MIN_PASSWORD).max(c.MAX_PASSWORD).required(),
});

module.exports = schema;
