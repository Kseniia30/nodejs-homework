const { updatingSchema } = require("./schemas/udatingSchema");

const updateContactValidation = (req, res, next) => {
  const validationResult = updatingSchema.validate(req.body);
  if (validationResult.error) {
    return res
      .status(400)
      .json({ validationError: validationResult.error.details[0].message });
  }

  next();
};

module.exports = {
  updateContactValidation,
};
