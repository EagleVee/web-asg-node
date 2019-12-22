import mongoose from "mongoose";

const ShiftSchema = mongoose.Schema(
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
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    }
  }
);

const ShiftModel = mongoose.model("Shift", ShiftSchema);

const find = async query => {
  const { paginate, page } = query;
  if (paginate && page !== undefined) {
    const limit = Number(paginate);
    const skip = (Number(page) - 1) * Number(paginate);
    delete query.paginate;
    delete query.page;
    return ShiftModel.find(query)
      .limit(limit)
      .skip(skip)
      .populate("class");
  } else {
    return ShiftModel.find(query).populate("class");
  }
};

const count = async query => {
  return ShiftModel.count(query);
};

const findById = async id => {
  return ShiftModel.findById(id).populate("class");
};

const create = async data => {
  const newDocument = new ShiftModel(data);
  return newDocument.save();
};

const update = async (id, data) => {
  return ShiftModel.findByIdAndUpdate(id, { $set: data }, { new: true });
};

const deleteById = async id => {
  return ShiftModel.findByIdAndDelete(id);
};

const repository = {
  find,
  findById,
  count,
  create,
  update,
  deleteById
};

export default repository;
