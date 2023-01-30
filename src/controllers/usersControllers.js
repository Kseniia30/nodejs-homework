const gravatar = require("gravatar");
const {
  registration,
  login,
  logout,
  getCurrent,
  changeUserSubscription,
  changeAvatar,
} = require("../models/users");
const { User } = require("../../db/userModel");

const registrationController = async (req, res, next) => {
  const { name, email, password } = req.body;
  await registration(name, email, password);
  const userInfo = await User.findOne({ email });

  res.status(200).json({
    user: {
      email: userInfo.email,
      subscription: userInfo.subscription,
    },
  });
};

const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  const token = await login({ email, password });
  const userInfo = await User.findOne({ email });
  res.status(200).json({
    token,
    user: {
      email: userInfo.email,
      subscription: userInfo.subscription,
    },
  });
};

const logoutController = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const currentUser = await User.findOne({ token });

  await logout({ _id: currentUser._id });

  res.status(204).end();
};

const getCurrentUserController = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const currentUser = await getCurrent(token);

  res.status(200).json({ currentUser });
};

const changeSubscriptionController = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new Error(401, "Unautorized");
  }

  const { subscription } = req.body;

  const changedUserSubscription = await changeUserSubscription(
    token,
    subscription
  );

  if (!changedUserSubscription) {
    return res.status(404).json({ message: "Not found" });
  }

  res.status(200).json({
    message: `User subscription type was changed to ${subscription}`,
  });
};

const changeAvatarController = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new Error(401, "Unautorized");
  }

  const avatarURL = gravatar.url(req.body.email);

  const { originalname, path: tempUpload } = req.file;

  const changedUserAvatar = await changeAvatar(
    token,
    originalname,
    tempUpload,
    avatarURL
  );

  if (!changedUserAvatar) {
    return res.status(404).json({ message: "Not found" });
  }

  res.status(200).json({ message: "User avatar was changed." });
};

module.exports = {
  registrationController,
  loginController,
  logoutController,
  getCurrentUserController,
  changeSubscriptionController,
  changeAvatarController,
};
