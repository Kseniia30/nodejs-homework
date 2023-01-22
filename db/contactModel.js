const mongoose = require("mongoose");

const contactsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 3,
      maxLength: 30,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      minLength: 10,
      maxLength: 20,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
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
