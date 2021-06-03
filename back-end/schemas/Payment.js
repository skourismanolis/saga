const Joi = require('joi');
const c = require('./schemas_constants');

const schema = Joi.object().keys({
	idPayment: Joi.number().integer().min(c.MIN_ID).required(),
	idUser: Joi.number().integer().min(c.MIN_ID).required(),
	amount: Joi.number().min(0).required(),
	timestamp: Joi.date().timestamp().required(),
});

module.exports = schema;
