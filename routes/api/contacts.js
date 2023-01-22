const express = require("express");

const router = express.Router();

const {
  addContactValidation,
} = require("../../utils/validation/validationSchemaAdding");

const {
  updateContactValidation,
} = require("../../utils/validation/validationSchemaUndating");

const {
  getContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  changeContactStatus,
} = require("../../models/contacts");
const {
  changeStatusContactValidation,
} = require("../../middlewares/validation/changeStatusContactValidation");
const checkJWT = require("../../middlewares/checkJwt");

router.use(checkJWT);

router.get("/", async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    let { page = 1, limit = 10 } = req.query;
    limit = limit > 10 ? 10 : limit;
    const skip = (page - 1) * limit;

    const contactList = await getContacts(owner, skip, limit);

    res.status(200).json(contactList);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }

  next();
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { contactId } = req.params;

    const contactById = await getContactById(contactId, owner);

    res.status(200).json(contactById);
  } catch (error) {
    res.json({ Error: error.message });
  }
  next();
});

router.post("/", addContactValidation, async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const { _id: owner } = req.user;

    const newContact = await addContact({ name, email, phone }, owner);

    res
      .status(201)
      .json({ message: `Contact ${newContact.name} was successfully added` });
  } catch (error) {
    res.status(400).json({ Error: error.message });
  }
  next();
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { contactId } = req.params;
    const contact = await getContactById(contactId, owner);

    if (!contact) {
      return res.status(404).json({
        message: `There is no contact with id ${contactId}`,
      });
    }

    await removeContact(contactId, owner);

    res.status(200).json({ message: "The contact was deleted." });
  } catch (error) {
    res.status(404).json({ Error: error.message });
  }

  next();
});

router.put("/:contactId", updateContactValidation, async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { contactId } = req.params;

    const contactById = await getContactById(contactId, owner);
    if (!contactById) {
      return res.status(404).json({
        message: `There is no contact with id ${req.params.contactId} to change`,
      });
    }
    const { name, email, phone } = req.body;
    const updatedContact = await updateContact(
      contactId,
      { name, email, phone },
      owner
    );
    console.log(updatedContact);

    res.status(200).json({
      message: `Contact ${name} was successfully changed`,
      contact: contactById,
    });
  } catch (error) {
    res.status(400).json({ Error: error.message });
  }

  next();
});

router.patch(
  "/:contactId",
  changeStatusContactValidation,
  async (req, res, next) => {
    try {
      const { favorite } = req.body;
      const { contactId } = req.params;
      const { _id: owner } = req.user;

      const changedContactStatus = await changeContactStatus(
        contactId,
        favorite,
        owner
      );

      if (!changedContactStatus) {
        return res.status(404).json({ message: "Not found" });
      }

      res.status(200).json({ message: "The status was changed" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
