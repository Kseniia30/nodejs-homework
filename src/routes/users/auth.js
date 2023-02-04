const express = require("express");

const {
  registrationController,
  loginController,
  logoutController,
  getCurrentUserController,
  changeSubscriptionController,
  changeAvatarController,
  verificationController,
  resendVerificationController,
} = require("../../controllers/usersControllers");

const { asyncWrapper } = require("../../helpers/asyncWrapper");
const checkJWT = require("../../middlewares/checkJwt");
const uploadMiddleware = require("../../middlewares/uploadAvatarMiddleware");

const {
  loginValidation,
} = require("../../middlewares/validation/loginValidation");
const {
  registrationValidation,
} = require("../../middlewares/validation/registrationValidation");
const {
  verifyValidation,
} = require("../../middlewares/validation/verifyValidation");

const router = express.Router();

router.post(
  "/signup",
  registrationValidation,
  asyncWrapper(registrationController)
);

router.post("/login", loginValidation, asyncWrapper(loginController));

router.get("/logout", asyncWrapper(logoutController));

router.get("/current", checkJWT, asyncWrapper(getCurrentUserController));

router.patch("/current", checkJWT, asyncWrapper(changeSubscriptionController));

router.patch(
  "/avatars",
  checkJWT,
  uploadMiddleware.single("avatar"),
  asyncWrapper(changeAvatarController)
);

router.get("/verify/:verificationToken", asyncWrapper(verificationController));
router.post(
  "/verify",
  verifyValidation,
  asyncWrapper(resendVerificationController)
);

module.exports = router;
