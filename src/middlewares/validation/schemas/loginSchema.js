const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().min(3).max(30).required(),
});

module.exports = {
  loginSchema,
};
