const { User } = require("../../db/userModel");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const { replaceAvatar } = require("../helpers/replaceAvatar");
const sendMail = require("../helpers/sendEmail");
const { uuid } = require("uuidv4");

const registration = async (name, email, password) => {
  const candidate = await User.findOne({ email });

  if (candidate) {
    throw new Error("Email in use");
  }
  const avatarURL = gravatar.url(email);
  const verificationToken = uuid();
  const user = new User({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    avatarURL,
    verificationToken,
  });
  await user.save();
  user.password = null;
  await sendMail(email, verificationToken);

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

const getCurrent = async (token, req) => {
  const currentUser = {
    email: req.user.email,
    subscription: req.user.subscription,
  };
  return currentUser;
};

const changeUserSubscription = async (token, req, subscription) => {
  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { subscription } }
  );

  return { message: `User subscription type was changed on ${subscription}` };
};

const changeAvatar = async (
  token,
  req,
  originalname,
  tempUpload,
  avatarURL
) => {
  const newAvatarURL = await replaceAvatar(originalname, tempUpload);
  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { avatarURL: newAvatarURL } }
  );

  return { message: "User avatar was changed." };
};

const verification = async (verificationToken) => {
  const user = await User.findOne({
    verificationToken,
    verify: false,
  });
  console.log(user);

  if (!user) {
    throw new Error(404, "Not found");
  }

  user.verificationToken = "null";
  user.verify = true;

  await user.save();

  return { message: "User was verified." };
};

const resendVerification = async ({ email }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error(404, "User not found!");
  }

  if (user.verify) {
    throw new Error(400, "Verification has already been passed!");
  }

  sendMail(email, user.verificationToken);

  return { message: "User is verified." };
};

module.exports = {
  registration,
  login,
  logout,
  getCurrent,
  changeUserSubscription,
  changeAvatar,
  verification,
  resendVerification,
};
