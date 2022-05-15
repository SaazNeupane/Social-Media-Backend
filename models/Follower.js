const mongoose = require(`mongoose`);
const { ObjectId } = mongoose.Schema.Types;

const followersSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: `User`,
    required: true,
  },
  followers: [
    {
      type: ObjectId,
      ref: `User`,
      required: true,
    },
  ],
  following: [
    {
      type: ObjectId,
      ref: `User`,
      required: true,
    },
  ],
  requests: [
    {
      type: ObjectId,
      ref: `User`,
      required: true,
    },
  ],
  sentRequests: [
    {
      type: ObjectId,
      ref: `User`,
      required: true,
    },
  ],
});

module.exports = mongoose.model("Followers", followersSchema);
