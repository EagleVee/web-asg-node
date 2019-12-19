import mongoose from "mongoose";

const AccessTokenSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectID,
      required: true,
      ref: "User"
    },
    jwtToken: {
      type: String,
      required: true
    },
    expiredAt: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    }
  }
);

const AccessTokenModel = mongoose.model("AccessToken", AccessTokenSchema);

const find = async query => {
  return AccessTokenModel.find(query);
};

const findById = async id => {
  return AccessTokenModel.findById(id);
};

const findByToken = async token => {
  return AccessTokenModel.findOne({ jwtToken: token }).populate("user");
};

const create = async data => {
  const newDocument = new AccessTokenModel(data);
  return newDocument.save();
};

const update = async (id, data) => {
  return AccessTokenModel.findByIdAndUpdate(id, { $set: data }, { new: true });
};

const updateExpireAt = async (token, expireAt) => {
  return AccessTokenModel.updateOne(
    { jwtToken: token },
    { $set: { expired_at: expireAt } },
    { new: true }
  );
};

const deleteById = async id => {
  return AccessTokenModel.findByIdAndDelete(id);
};

const repository = {
  find,
  findById,
  findByToken,
  create,
  update,
  updateExpireAt,
  deleteById
};

export default repository;
