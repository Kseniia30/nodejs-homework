const { loginSchema } = require("./schemas/loginSchema");

const loginValidation = (req, res, next) => {
  const validationResult = loginSchema.validate(req.body);
  if (validationResult.error) {
    return res
      .status(400)
      .json({ validationError: validationResult.error.details[0].message });
  }

  next();
};

module.exports = {
  loginValidation,
};
