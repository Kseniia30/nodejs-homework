const Joi = require("joi");

const schema = Joi.object({
  favorite: Joi.boolean().required(),
});

const changeStatusContactValidation = (req, res, next) => {
  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    return res
      .status(400)
      .json({ validationError: validationResult.error.details[0].message });
  }

  next();
};

module.exports = {
  changeStatusContactValidation,
};
