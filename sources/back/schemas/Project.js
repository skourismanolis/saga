const Joi = require('joi');
const c = require('./schemas_constants');
const ProjectMemberShort = require('./ProjectMemberShort');

const schema = Joi.object().keys({
	idProject: Joi.number().integer().min(c.MIN_ID).required(),
	title: Joi.string().min(c.MIN_STRING).max(c.MAX_STRING_LONG).required(),
	picture: Joi.string()
		.min(c.MIN_STRING)
		.max(c.MAX_STRING)
		.required()
		.allow(null),
	members: Joi.array().items(ProjectMemberShort).required(),
});

module.exports = schema;
