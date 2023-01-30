const uploadAvatarController = async (req, res, next) => {
  res.status(200).json({ message: "Success" });
};

module.exports = {
  uploadAvatarController,
};
