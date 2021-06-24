const Joi = require('joi');
const c = require('./schemas_constants');

const schema = Joi.array().min(1).items(Joi.string()).unique().required();

module.exports = schema;
