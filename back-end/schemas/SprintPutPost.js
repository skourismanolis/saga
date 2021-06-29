const Joi = require('joi');
const c = require('./schemas_constants');

const schema = Joi.object().keys({
	title: Joi.string().min(c.MIN_STRING).max(c.MAX_STRING_LONG).required(),
	deadline: Joi.date().required().allow(null),
});

module.exports = schema;
