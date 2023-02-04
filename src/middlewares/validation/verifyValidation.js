const { verifySchema } = require("./schemas/verifySchema");

const verifyValidation = (req, res, next) => {
  const validationResult = verifySchema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json(validationResult.error.details);
  }
  next();
};

module.exports = {
  verifyValidation,
};
