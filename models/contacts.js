const fs = require("fs").promises;
const path = require("path");
const contactsPath = path.resolve("models/contacts.json");

const getContacts = async () => {
  const contacts = await fs.readFile(contactsPath, "utf8");
  return JSON.parse(contacts);
};

const getContactById = async (contactId) => {
  const contacts = await getContacts();
  const contact = contacts.find((item) => item.id === contactId);
  return contact;
};

const removeContact = async (contactId) => {
  const contact = await getContactById(contactId);
  const contacts = await getContacts();
  const newContactList = contacts.filter((item) => item.id !== contactId);
  fs.writeFile(contactsPath, JSON.stringify(newContactList, null, 2));
  return contact;
};

const addContact = async (body) => {
  const contacts = await getContacts();
  const { name, email, phone } = body;
  const newContact = {
    id: new Date().getTime().toString(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await getContacts();
  const contactIndex = contacts.findIndex((item) => item.id === contactId);
  const updatedContact = contacts[contactIndex];
  const { name, email, phone } = body;
  updatedContact.name = name;
  updatedContact.email = email;
  updatedContact.phone = phone;
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return updatedContact;
};

module.exports = {
  getContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
