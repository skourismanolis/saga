const Joi = require('joi');
const c = require('./schemas_constants');

const schema = Joi.object().keys({
	code: Joi.string().min(c.MIN_STRING).max(c.MAX_STRING).required(),
	content: Joi.string().min(c.MIN_TEXT).max(c.MAX_TEXT).required(),
});

module.exports = schema;
