const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const {
  uploadAvatarController,
} = require("../../controllers/filesControllers");
const { asyncWrapper } = require("../../helpers/asyncWrapper");

const FILE_DIR = path.resolve("tmp");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, FILE_DIR);
  },
  filename: function (req, file, cb) {
    const [, extention] = file.originalname.split(".");
    cb(null, `${uuidv4()}.${extention}`);
  },
});

const uploadMiddleware = multer({ storage });

router.post(
  "/upload",
  uploadMiddleware.single("avatar"),
  asyncWrapper(uploadAvatarController)
);

router.use("/download", express.static(FILE_DIR));

module.exports = router;
