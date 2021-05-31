const Joi = require('joi');
const c = require('./schemas_constants');

const schema = Joi.object().keys({
	title: Joi.string().min(c.MIN_STRING).max(c.MAX_STRING_LONG).required(),
	start: Joi.date().required().allow(null),
	deadline: Joi.date().required().allow(null),
	description: Joi.string().min(c.MIN_TEXT).max(c.MAX_TEXT).allow(null),
});

module.exports = schema;
