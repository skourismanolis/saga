const Joi = require('joi');
const c = require('./schemas_constants');

const schema = Joi.number().integer().min(c.MIN_ID).required().allow(null);

module.exports = schema;
