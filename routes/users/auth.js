const express = require("express");
const { User } = require("../../db/userModel");

const {
  loginValidation,
} = require("../../middlewares/validation/loginValidation");
const {
  registrationValidation,
} = require("../../middlewares/validation/registrationValidation");
const {
  registration,
  login,
  logout,
  getCurrent,
  changeUserSubscription,
} = require("../../models/users");

const router = express.Router();

router.post("/signup", registrationValidation, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    await registration(name, email, password);
    const userInfo = await User.findOne({ email });

    res.status(200).json({
      user: {
        email: userInfo.email,
        subscription: userInfo.subscription,
      },
    });
  } catch (error) {
    res.status(409).json("Email in use");
  }
});

router.post("/login", loginValidation, async (req, res, next) => {
  try {
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
  } catch (error) {
    res.status(401).json("Email or password is wrong");
  }
});

router.get("/logout", async (req, res, next) => {
  try {
    const { _id } = req.user;

    await logout({ _id });

    res.status(204).end();
  } catch (error) {
    res.status(401).json("Unautorized");
  }
});

router.get("/current", async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token);
    const currentUser = await getCurrent(token);
    console.log(currentUser);

    res.status(200).json({ currentUser });
  } catch (error) {
    res.status(401).json({ message: "Unautorized" });
  }
});

router.patch("/current", async (req, res, next) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      message: `Not found`,
    });
  }
});

module.exports = router;
