const { User } = require("../db/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registration = async (name, email, password) => {
  const candidate = await User.findOne({ email });

  if (candidate) {
    throw new Error("Email in use");
  }

  const user = new User({
    name,
    email,
    password: await bcrypt.hash(password, 10),
  });
  await user.save();
  return user;
};

const login = async ({ email, password }) => {
  const candidate = await User.findOne({ email });
  const isPasswordCorrect = await bcrypt.compare(password, candidate.password);

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

module.exports = {
  registration,
  login,
  logout,
  getCurrent,
  changeUserSubscription,
};
