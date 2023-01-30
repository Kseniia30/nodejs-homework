const { Contacts } = require("../../db/contactModel");

const getContacts = async (owner, skip, limit) => {
  const contacts = await Contacts.find({ owner })
    .select({ __v: 0 })
    .skip(skip)
    .limit(limit);
  return { contacts };
};

const getContactById = async (contactId, owner) => {
  const contact = await Contacts.findOne({ _id: contactId, owner }).select({
    _v: 0,
  });

  if (!contactId) {
    return { message: "Not found" };
  }

  return contact;
};

const removeContact = async (contactId, owner) => {
  await Contacts.findOneAndRemove({ _id: contactId, owner });
};

const addContact = async ({ name, email, phone }, owner) => {
  const contact = new Contacts({ name, email, phone, owner });
  await contact.save();
  return contact;
};

const updateContact = async (contactId, body, owner) => {
  const { name, email, phone } = body;
  await Contacts.findOneAndUpdate(
    { _id: contactId, owner },
    { $set: { name, email, phone } }
  );
};

const changeContactStatus = async (contactId, status, owner) => {
  await Contacts.findOneAndUpdate(
    { _id: contactId, owner },
    { $set: { favorite: status } }
  );

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
