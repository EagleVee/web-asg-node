import mongoose from "mongoose";

const ClassSchema = mongoose.Schema(
  {
    name: {
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

const ClassModel = mongoose.model("User", ClassSchema);

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

const count = async query => {
  return ClassModel.count(query);
};

const findById = async id => {
  return ClassModel.findById(id);
};

const findByEmail = async email => {
  return ClassModel.findOne({ email: email });
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
