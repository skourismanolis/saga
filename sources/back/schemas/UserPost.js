const Joi = require('joi');

// const MAX_INT = 1000;
// const MAX_TEXT = 65535;
const MAX_STRING = 255;

const schema = Joi.object().keys({
	username: Joi.string().required().min(1).max(MAX_STRING),
	email: Joi.string().required().min(1).max(MAX_STRING),
	password: Joi.string().required().min(1).max(MAX_STRING),
	name: Joi.string().required().min(1).max(MAX_STRING),
	surname: Joi.string().required().min(1).max(MAX_STRING),
	profession: Joi.string().min(0).max(MAX_STRING),
	birthDate: Joi.date().required(),
	studies: Joi.string().min(0).max(MAX_STRING),
	residence: Joi.string().min(0).max(MAX_STRING),
	picture: Joi.string().min(0).max(MAX_STRING),
	plan: Joi.string().required().valid('Free', 'Premium', 'Host'),
});

module.exports = schema;
