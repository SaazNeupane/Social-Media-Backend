const { Follower } = require(`../models`);
const catchAsyncErrors = require(`../middleware/catchAsyncErrors`);
const responseHandler = require(`../utils/responseHandler`);
const ErrorHandler = require("../utils/ErrorHandler");

//Send Follow Request
exports.sendFollowRequest = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const { wannaFollowId } = req.params;

  if (userId.toString() === wannaFollowId.toString()) {
    return responseHandler(
      false,
      `You can't follow yourself.`,
      400,
      `VALIDATION`,
      {},
      res
    );
  }

  const alreadyFollowed = await Follower.findOne({
    userId: userId,
    followers: { $in: [wannaFollowId] },
  });

  if (alreadyFollowed) {
    return responseHandler(
      false,
      `You already follow this user.`,
      400,
      `VALIDATION`,
      {},
      res
    );
  }

  const alreadySent = await Follower.findOne({
    userId: userId,
    sentRequest: { $in: [wannaFollowId] },
  });

  if (alreadySent) {
    return responseHandler(
      false,
      `You already sent follow request to this user.`,
      400,
      `VALIDATION`,
      {},
      res
    );
  }

  const incomingRequest = await Follower.findOne({
    userId: userId,
    requests: [wannaFollowId],
  });

  if (incomingRequest) {
    return responseHandler(
      false,
      `You already received follow request from this user.`,
      400,
      `VALIDATION`,
      {},
      res
    );
  }

  await Follower.updateOne(
    { userId: userId },
    { $push: { sentRequests: wannaFollowId } },
    { upsert: true }
  );

  await Follower.updateOne(
    { userId: wannaFollowId },
    { $push: { requests: userId } },
    { upsert: true }
  );

  return responseHandler(
    true,
    `Follow request sent successfully.`,
    200,
    `VALIDATION`,
    {},
    res
  );
});

exports.handleFollowRequest = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const { action, senderId } = req.params;
  let message = ``;

  const alreadyAccepted = await Follower.findOne({
    userId: userId,
    following: { $in: [senderId] },
  });

  if (alreadyAccepted) {
    return responseHandler(
      false,
      `You already follow this user.`,
      400,
      `VALIDATION`,
      {},
      res
    );
  }

  if (action === `accept`) {
    await Follower.updateOne(
      { userId: userId },
      { $push: { followers: senderId }, $pull: { requests: senderId } },
      { upsert: true }
    );

    await Follower.updateOne(
      { userId: senderId },
      { $pull: { sentRequests: userId }, $push: { following: userId } },
      { upsert: true }
    );

    message = `Follow request accepted successfully.`;
  } else if (action === `cancel`) {
    await Follower.updateOne(
      { userId: userId },
      { $pull: { requests: senderId } },
      { upsert: true }
    );

    await Follower.updateOne(
      { userId: senderId },
      { $pull: { sentRequests: userId } },
      { upsert: true }
    );

    message = `Follow request cancelled successfully.`;
  }

  return responseHandler(true, message, 200, `VALIDATION`, {}, res);
});

exports.getAllFollowers = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const { searchTerm } = req.query;
  let options = {};

  if (searchTerm) {
    options = {
      match: {
        fullName: {
          $regex: searchTerm,
          $options: "i",
        },
      },
    };
  }

  const followers = await Follower.findOne({ userId: userId })
    .select(`followers`)
    .populate({
      path: `followers`,
      select: `fullName profilePicture`,
      ...options,
    });

  return responseHandler(
    true,
    `Followers fetched successfully.`,
    200,
    `VALIDATION`,
    followers,
    res
  );
});

exports.getFollowRequest = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const requests = await Follower.findOne({ userId: userId })
    .select(`requests`)
    .populate({
      path: `requests`,
      select: `fullName profilePicture`,
    });

  return responseHandler(
    true,
    `Follow request fetched successfully.`,
    200,
    `VALIDATION`,
    requests,
    res
  );
});

exports.getSentFollowRequest = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const sentRequests = await Follower.findOne({ userId: userId })
    .select(`sentRequests`)
    .populate({
      path: `sentRequests`,
      select: `fullName profilePicture`,
    });

  return responseHandler(
    true,
    `Sent follow request fetched successfully.`,
    200,
    `VALIDATION`,
    sentRequests,
    res
  );
});

//UnFollow
exports.unFollow = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const { followingId } = req.params;

  const follower = await Follower.findOne({
    userId: userId,
    followers: { $in: [followingId] },
  });

  if (!follower) {
    return responseHandler(
      false,
      `You don't follow this user.`,
      400,
      `VALIDATION`,
      {},
      res
    );
  }

  await Follower.updateOne(
    { userId: userId },
    { $pull: { followers: followingId } },
    { upsert: true }
  );

  await Follower.updateOne(
    { userId: followingId },
    { $pull: { followers: userId } },
    { upsert: true }
  );

  return responseHandler(
    true,
    `Un-followed successfully.`,
    200,
    `VALIDATION`,
    {},
    res
  );
});
