const { User } = require(`../models`);
const catchAsyncErrors = require(`../middleware/catchAsyncErrors`);
const responseHandler = require(`../utils/responseHandler`);
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require("../utils/jwtToken");

exports.guestLogin = catchAsyncErrors(async (req, res, next) => {
  const user = new User({
    fullName: await getUniqueName(),
    role: `guest`,
  });

  await user.save();
  sendToken(user, 200, "Guest Account Activated", res);
});

exports.socialLogin = catchAsyncErrors(async (req, res, next) => {
  const { authProvider, profileId, email } = req.body;
  const savedUser = await User.findOne({
    $or: [
      { authProvider: authProvider, profileId: profileId },
      { email: email },
    ],
  });
  if (!savedUser) {
    const user = await User.create(req.body);
    sendToken(user, 200, "User logged in successfully", res);
  } else {
    sendToken(savedUser, 200, "User logged in successfully or", res);
  }
});

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({
    role: { $nin: [`guest`, `admin`] },
    _id: { $nin: [req.user._id] },
  }).lean();

  return responseHandler(true, `All users fetch.`, 200, ``, { users }, res);
});

exports.getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  return responseHandler(true, `User fetched.`, 200, ``, { user }, res);
});

const getUniqueName = async () => {
  const fullName = `guest${Math.floor(100000 + Math.random() * 900000)}`;
  const user = await User.findOne({ fullName });
  if (!user) {
    return fullName;
  }
  await getUniqueName();
};
