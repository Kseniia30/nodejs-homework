const { addingSchema } = require("./schemas/addingSchema");

const addContactValidation = (req, res, next) => {
  const validationResult = addingSchema.validate(req.body);
  if (validationResult.error) {
    return res
      .status(400)
      .json({ status: validationResult.error.details[0].message });
  }

  next();
};

module.exports = {
  addContactValidation,
};
