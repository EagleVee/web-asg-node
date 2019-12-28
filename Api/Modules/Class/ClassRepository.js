import mongoose from "mongoose";

const ClassSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    lecturer: {
      type: String,
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

const ClassModel = mongoose.model("Class", ClassSchema);

const find = async query => {
  const { paginate, page } = query;
  if (paginate && page !== undefined) {
    const limit = Number(paginate);
    const skip = (Number(page) - 1) * Number(paginate);
    delete query.paginate;
    delete query.page;
    return ClassModel.find(query)
      .limit(limit)
      .skip(skip);
  } else {
    return ClassModel.find(query);
  }
};

const findLean = async query => {
  const { paginate, page } = query;
  if (paginate && page !== undefined) {
    const limit = Number(paginate);
    const skip = (Number(page) - 1) * Number(paginate);
    delete query.paginate;
    delete query.page;
    return ClassModel.find(query)
      .limit(limit)
      .skip(skip)
      .lean();
  } else {
    return ClassModel.find(query).lean();
  }
};

const findOne = async query => {
  return ClassModel.findOne(query);
};

const findOneLean = async query => {
  return ClassModel.findOne(query).lean();
};

const count = async query => {
  return ClassModel.count(query);
};

const findById = async id => {
  return ClassModel.findById(id);
};

const findByIdLean = async id => {
  return ClassModel.findById(id).lean();
};

const create = async data => {
  const newDocument = new ClassModel(data);
  return newDocument.save();
};

const update = async (id, data) => {
  return ClassModel.findByIdAndUpdate(id, { $set: data }, { new: true });
};

const deleteById = async id => {
  return ClassModel.findByIdAndDelete(id);
};

const deleteMany = async query => {
  return ClassModel.deleteMany(query);
};

const repository = {
  find,
  findOne,
  findOneLean,
  findLean,
  findById,
  findByIdLean,
  count,
  create,
  update,
  deleteById,
  deleteMany
};

export default repository;
