const express = require("express");

const router = express.Router();

const {
  getContactsController,
  getContactByIdController,
  addContactController,
  removeContactController,
  updateContactController,
  changeContactStatusController,
} = require("../../controllers/contactsControllers");

const checkJWT = require("../../middlewares/checkJwt");
const { asyncWrapper } = require("../../helpers/asyncWrapper");
const {
  addContactValidation,
} = require("../../middlewares/validation/addingValidation");
const {
  updateContactValidation,
} = require("../../middlewares/validation/updatingValidation");
const {
  changeStatusContactValidation,
} = require("../../middlewares/validation/changeStatusContactValidation");

router.use(checkJWT);

router.get("/", asyncWrapper(getContactsController));

router.get("/:contactId", asyncWrapper(getContactByIdController));

router.post("/", addContactValidation, asyncWrapper(addContactController));

router.delete("/:contactId", asyncWrapper(removeContactController));

router.put(
  "/:contactId",
  updateContactValidation,
  asyncWrapper(updateContactController)
);

router.patch(
  "/:contactId",
  changeStatusContactValidation,
  asyncWrapper(changeContactStatusController)
);

module.exports = router;
