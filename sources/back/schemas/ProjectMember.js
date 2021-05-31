const Joi = require('joi');
const c = require('./schemas_constants');

const schema = Joi.object().keys({
	idUser: Joi.number().required().integer().min(c.MIN_ID),
	role: Joi.string().valid('Admin', 'Member').required(),
	name: Joi.string().min(c.MIN_STRING).max(c.MAX_STRING).required(),
	surname: Joi.string().min(c.MIN_STRING).max(c.MAX_STRING).required(),
	email: Joi.string().email().required(),
	picture: Joi.string().max(c.MAX_STRING).required().allow(null),
});

module.exports = schema;
