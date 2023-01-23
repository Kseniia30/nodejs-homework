const { statusSchema } = require("./schemas/statusSchema");

const changeStatusContactValidation = (req, res, next) => {
  const validationResult = statusSchema.validate(req.body);
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
