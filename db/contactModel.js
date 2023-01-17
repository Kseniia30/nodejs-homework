const mongoose = require("mongoose");

const contactsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 3,
      maxLength: 30,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      // match: [
      //   /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/,
      //   "Please fill a valid email address",
      // ],
      unique: true,
    },
    phone: {
      type: String,
      minLength: 10,
      maxLength: 20,
      required: true,
      unique: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    collection: "contacts",
  }
);

const Contacts = mongoose.model("contacts", contactsSchema);

module.exports = {
  Contacts,
};
