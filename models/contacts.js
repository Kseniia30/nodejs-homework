const { Contacts } = require("../db/contactModel");

const getContacts = async () => {
  const contacts = await Contacts.find({});
  return { contacts };
};

const getContactById = async (contactId) => {
  const contact = await Contacts.findById(contactId);

  if (!contactId) {
    return { message: "Not found" };
  }

  return contact;
};

const removeContact = async (contactId) => {
  await Contacts.findByIdAndRemove(contactId);

  if (!contactId) {
    return { message: "Not found" };
  }

  return { message: `The contact was removed` };
};

const addContact = async (body) => {
  const { name, email, phone } = body;
  const contact = new Contacts({ name, email, phone });
  await contact.save();
  return contact;
};

const updateContact = async (contactId, body) => {
  const { name, email, phone } = body;
  await Contacts.findByIdAndUpdate(contactId, { $set: { name, email, phone } });

  return { message: "The contact was updated" };
};

const changeContactStatus = async (contactId, status) => {
  await Contacts.findByIdAndUpdate(contactId, { $set: { favorite: status } });

  return { message: "The status was changed" };
};

module.exports = {
  getContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  changeContactStatus,
};
