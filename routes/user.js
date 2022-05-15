const express = require("express");
const router = express.Router();
const {
  guestLogin,
  socialLogin,
  getAllUsers,
  getUser,
} = require(`../controllers/userController`);
const { isAuthenticatedUser } = require(`../middleware/auth`);

router.route("/login/guest").post(guestLogin);
router.route("/login/social").post(socialLogin);
router.route("/allUsers").get(isAuthenticatedUser, getAllUsers);
router.route("/user/:id").get(isAuthenticatedUser, getUser);

module.exports = router;
