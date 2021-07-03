const Joi = require('joi');
const c = require('./schemas_constants');

const schema = Joi.object().keys({
	idLabel: Joi.number().integer().min(c.MIN_ID).required().allow(null),
	title: Joi.string().min(c.MIN_STRING).max(c.MAX_STRING_LONG).required(),
	category: Joi.string().valid('Story', 'Task', 'Bug').required(),
	points: Joi.number().integer().required().allow(null),
	priority: Joi.string()
		.valid('Very Low', 'Low', 'Neutral', 'High', 'Very High')
		.required(),
	deadline: Joi.date().required().allow(null).greater('now'),
	description: Joi.string()
		.min(c.MIN_TEXT)
		.max(c.MAX_TEXT)
		.required()
		.allow(null),
	assignees: Joi.array().min(1).items(Joi.number().integer()).required().allow(null),
});

module.exports = schema;
