import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    studentId: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      default: "student"
    }
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    }
  }
);

const UserModel = mongoose.model("User", UserSchema);

const find = async query => {
  const { paginate, page } = query;
  if (paginate && page !== undefined) {
    const limit = Number(paginate);
    const skip = (Number(page) - 1) * Number(paginate);
    delete query.paginate;
    delete query.page;
    return UserModel.find(query)
      .limit(limit)
      .skip(skip);
  } else {
    return UserModel.find(query);
  }
};

const findOne = async query => {
  return UserModel.findOne(query);
};

const count = async query => {
  return UserModel.count(query);
};

const findById = async id => {
  return UserModel.findById(id);
};

const findByEmail = async email => {
  return UserModel.findOne({ email: email });
};

const create = async data => {
  const newDocument = new UserModel(data);
  return newDocument.save();
};

const update = async (id, data) => {
  return UserModel.findByIdAndUpdate(id, { $set: data }, { new: true });
};

const deleteById = async id => {
  return UserModel.findByIdAndDelete(id);
};

const repository = {
  find,
  findOne,
  findById,
  findByEmail,
  count,
  create,
  update,
  deleteById
};

export default repository;
