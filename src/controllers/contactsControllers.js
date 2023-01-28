const {
  getContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  changeContactStatus,
} = require("../models/contacts");

const getContactsController = async (req, res, next) => {
  const { _id: owner } = req.user;
  let { page = 1, limit = 10 } = req.query;
  limit = limit > 10 ? 10 : limit;
  const skip = (page - 1) * limit;

  const contactList = await getContacts(owner, skip, limit);

  res.status(200).json(contactList);
  next();
};

const getContactByIdController = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;

  const contactById = await getContactById(contactId, owner);

  res.status(200).json(contactById);
};

const addContactController = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const { _id: owner } = req.user;

  const newContact = await addContact({ name, email, phone }, owner);

  res
    .status(201)
    .json({ message: `Contact ${newContact.name} was successfully added` });
  next();
};

const removeContactController = async (req, res, next) => {
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

  next();
};

const updateContactController = async (req, res, next) => {
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
  next();
};

const changeContactStatusController = async (req, res, next) => {
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
  next();
};

module.exports = {
  getContactsController,
  getContactByIdController,
  addContactController,
  removeContactController,
  updateContactController,
  changeContactStatusController,
};
