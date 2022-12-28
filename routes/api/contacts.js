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
} = require("../../models/contacts");

router.get("/", async (req, res, next) => {
  try {
    const contacts = await getContacts();
    res.status(200);
    res.json(contacts);
  } catch (error) {
    res.status(404);
    return res.json({
      message: error.message,
    });
  }

  next();
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (!contact) {
      res.status(404);
      res.json({
        message: `There is no contact with id ${req.params.contactId} in contact-list`,
      });
      return;
    }
    res.status(200);
    res.json(contact);
  } catch (error) {
    res.json({ Error: error.message });
  }
  next();
});

router.post("/", addContactValidation, async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    await addContact({ name, email, phone });
    const contacts = await getContacts();
    res.status(200);
    res.json(contacts);
  } catch (error) {
    res.status(400);
    res.json({ Error: error.message });
  }
  next();
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const searchContact = await getContactById(req.params.contactId);
    if (!searchContact) {
      return res.json({
        status: "404. Not Found",
        message: `There is no contact with id ${req.params.contactId} to delete`,
      });
    }
    await removeContact(req.params.contactId);
    const contacts = await getContacts();
    res.status(200);
    res.json(contacts);
  } catch (error) {
    res.status(404);
    res.json({ Error: error.message });
  }

  next();
});

router.put("/:contactId", updateContactValidation, async (req, res, next) => {
  try {
    const searchContact = await getContactById(req.params.contactId);
    if (!searchContact) {
      return res.json({
        status: "404. Not Found",
        message: `There is no contact with id ${req.params.contactId} to change`,
      });
    }
    const { name, email, phone } = req.body;
    await updateContact(req.params.contactId, {
      name,
      email,
      phone,
    });
    const contacts = await getContacts();
    res.status(200);
    res.json(contacts);
  } catch (error) {
    res.status(400);
    res.json({ Error: error.message });
  }

  next();
});

module.exports = router;
