const express = require("express");
const router = express.Router();
const {
  sendFollowRequest,
  handleFollowRequest,
  getAllFollowers,
  getFollowRequest,
  getSentFollowRequest,
  unFollow,
} = require(`../controllers/followersController`);

const { isAuthenticatedUser } = require(`../middleware/auth`);

router
  .route("/request/send/:wannaFollowId")
  .put(isAuthenticatedUser, sendFollowRequest);

router
  .route("/request/handle/:action/:senderId")
  .post(isAuthenticatedUser, handleFollowRequest);

router.route("/get-followers").get(isAuthenticatedUser, getAllFollowers);

router.route("/get-requests").get(isAuthenticatedUser, getFollowRequest);

router
  .route("/get-sent-requests")
  .get(isAuthenticatedUser, getSentFollowRequest);

router.route("/un-follow/:followingId").put(isAuthenticatedUser, unFollow);

module.exports = router;

module.exports = router;
