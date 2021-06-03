const Joi = require('joi');
const c = require('./schemas_constants');
const Issue = require('./Issue');

const schema = Joi.object().keys({
	idEpic: Joi.number().integer().min(c.MIN_ID).required(),
	title: Joi.string().min(c.MIN_STRING).max(c.MAX_STRING_LONG).required(),
	start: Joi.date().required().allow(null),
	deadline: Joi.date().required().allow(null),
	description: Joi.string().min(c.MIN_TEXT).max(c.MAX_TEXT).allow(null),
	issues: Joi.array().items(Issue).required(),
});

module.exports = schema;
