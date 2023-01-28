const jwt = require("jsonwebtoken");
const { User } = require("../db/userModel");
const { replaceAvatar } = require("../helpers/replaceAvatar");

const changeAvatar = async (token, originalname, tempUpload, avatarURL) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const user = await User.findById({ _id: payload._id });

  if (!user || !token) {
    throw new Error(401, "Unautorized");
  }

  const newAvatarURL = await replaceAvatar(originalname, tempUpload);

  await User.findOneAndUpdate(
    { _id: user._id },
    { $set: { avatarURL: newAvatarURL } }
  );

  return { message: "User avatar was changed." };
};

module.exports = {
  changeAvatar,
};
