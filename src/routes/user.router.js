const { Router } = require("express");

const {
  registration,
  login,
  getListUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  createUserImage,
  getUserImage,
} = require("../controllers/user.controller");
const User = require("../models/User.model")
const uploadImage = require("../utils/Upload");

const router = Router();

//routers
router.post("/registration", registration);
router.post("/login", login);
router.post("/image-upload/:id", uploadImage("../store/user", User), createUserImage);
router.get("/", getListUsers);
router.get("/:id", getUserById);
router.get("/image/:id", getUserImage);
router.put("/:id", updateUserById);
router.delete("/:id", deleteUserById);

module.exports = router;
