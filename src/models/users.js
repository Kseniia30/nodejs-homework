const { User } = require("../../db/userModel");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const { replaceAvatar } = require("../helpers/replaceAvatar");

const registration = async (name, email, password) => {
  const candidate = await User.findOne({ email });

  if (candidate) {
    throw new Error("Email in use");
  }
  const avatarURL = gravatar.url(email);
  const user = new User({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    avatarURL,
  });
  await user.save();
  user.password = null;
  return user;
};

const login = async ({ email, password }) => {
  const candidate = await User.findOne({ email });
  if (!candidate) {
    throw new Error(404, `There is no user with email ${email}`);
  }
  const isPasswordCorrect = await bcrypt.compare(password, candidate?.password);

  if (!candidate || !isPasswordCorrect) {
    throw new Error("Wrong email or password");
  }

  const token = jwt.sign(
    { _id: candidate._id, email: candidate.email },
    process.env.JWT_SECRET
  );

  await User.findByIdAndUpdate(candidate._id, { $set: { token } });

  return token;
};

const logout = async ({ _id }) => {
  await User.findByIdAndUpdate({ _id }, { $set: { token: null } });

  return { message: "The user was logged out" };
};

const getCurrent = async (token) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById({ _id: payload._id });

  if (!user || !token) {
    throw new Error("Unautorized");
  }

  const currentUser = { email: user.email, subscription: user.subscription };
  return currentUser;
};

const changeUserSubscription = async (token, subscription) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById({ _id: payload._id });

  if (!user || !token) {
    throw new Error("Unautorized");
  }

  await User.findOneAndUpdate({ _id: user._id }, { $set: { subscription } });

  return { message: `User subscription type was changed on ${subscription}` };
};

const changeAvatar = async (token, originalname, tempUpload, avatarURL) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
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
  registration,
  login,
  logout,
  getCurrent,
  changeUserSubscription,
  changeAvatar,
};
