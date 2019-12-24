import mongoose from "mongoose";

const ShiftRoomSchema = mongoose.Schema(
  {
    shift: {
      type: mongoose.Schema.Types.ObjectID,
      ref: "Shift",
      required: true
    },
    room: {
      type: mongoose.Schema.Types.ObjectID,
      ref: "Room",
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

const ShiftRoomModel = mongoose.model("ShiftRoom", ShiftRoomSchema);

const find = async query => {
  const { paginate, page } = query;
  if (paginate && page !== undefined) {
    const limit = Number(paginate);
    const skip = (Number(page) - 1) * Number(paginate);
    delete query.paginate;
    delete query.page;
    return ShiftRoomModel.find(query)
      .limit(limit)
      .skip(skip)
      .populate("shift")
      .populate("room");
  } else {
    return ShiftRoomModel.find(query)
      .populate("shift")
      .populate("room");
  }
};

const count = async query => {
  return ShiftRoomModel.count(query);
};

const findOne = async query => {
  return ShiftRoomModel.findOne(query);
};

const findById = async id => {
  return ShiftRoomModel.findById(id);
};

const create = async data => {
  const newDocument = new ShiftRoomModel(data);
  return newDocument.save();
};

const update = async (id, data) => {
  return ShiftRoomModel.findByIdAndUpdate(id, { $set: data }, { new: true });
};

const deleteById = async id => {
  return ShiftRoomModel.findByIdAndDelete(id);
};

const deleteMany = async query => {
  return ShiftRoomModel.deleteMany(query);
};

const repository = {
  find,
  findOne,
  findById,
  count,
  create,
  update,
  deleteById,
  deleteMany
};

export default repository;
