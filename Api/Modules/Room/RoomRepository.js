import mongoose from "mongoose";

const RoomSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    seat: {
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

const RoomModel = mongoose.model("Room", RoomSchema);

const find = async query => {
  const { paginate, page } = query;
  if (paginate && page !== undefined) {
    const limit = Number(paginate);
    const skip = (Number(page) - 1) * Number(paginate);
    delete query.paginate;
    delete query.page;
    return RoomModel.find(query)
      .limit(limit)
      .skip(skip);
  } else {
    return RoomModel.find(query);
  }
};

const count = async query => {
  return RoomModel.count(query);
};

const findById = async id => {
  return RoomModel.findById(id);
};

const create = async data => {
  const newDocument = new RoomModel(data);
  return newDocument.save();
};

const update = async (id, data) => {
  return RoomModel.findByIdAndUpdate(id, { $set: data }, { new: true });
};

const deleteById = async id => {
  return RoomModel.findByIdAndDelete(id);
};

const deleteMany = async query => {
  return RoomModel.deleteMany(query);
};

const repository = {
  find,
  findById,
  count,
  create,
  update,
  deleteById,
  deleteMany
};

export default repository;
