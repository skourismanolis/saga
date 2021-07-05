const Joi = require('joi');
const c = require('./schemas_constants');

const schema = Joi.object().keys({
	content: Joi.string().min(c.MIN_TEXT).max(c.MAX_TEXT).required(),
});

module.exports = schema;
