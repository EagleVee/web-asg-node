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
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
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
      .populate("room")
      .populate("students");
  } else {
    return ShiftRoomModel.find(query)
      .populate("shift")
      .populate("room")
      .populate("students");
  }
};

const findLean = async query => {
  return ShiftRoomModel.find(query)
    .populate("shift")
    .populate("room")
    .lean();
};

const count = async query => {
  return ShiftRoomModel.count(query);
};

const findOne = async query => {
  return ShiftRoomModel.findOne(query)
    .populate("shift")
    .populate("room")
    .populate("students");
};

const findOneLean = async query => {
  return ShiftRoomModel.findOne(query).lean();
};

const findById = async id => {
  return ShiftRoomModel.findById(id).lean();
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
  findLean,
  findOneLean,
  findById,
  count,
  create,
  update,
  deleteById,
  deleteMany
};

export default repository;
