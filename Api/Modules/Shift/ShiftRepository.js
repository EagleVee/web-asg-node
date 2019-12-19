import mongoose from "mongoose";

const RoomSchema = mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectID,
      ref: "Class",
      required: true
    },
    beginAt: {
      type: Number,
      required: true
    },
    endAt: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
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
      .skip(skip)
      .populate("class");
  } else {
    return RoomModel.find(query).populate("class");
  }
};

const count = async query => {
  return RoomModel.count(query);
};

const findById = async id => {
  return RoomModel.findById(id).populate("class");
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

const repository = {
  find,
  findById,
  findByEmail,
  count,
  create,
  update,
  deleteById
};

export default repository;
