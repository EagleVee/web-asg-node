import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    school: {
      type: String,
      required: false,
      default: "",
    },
    googleId: {
      type: String,
      required: false,
      default: "",
    },
    facebookId: {
      type: String,
      required: false,
      default: "",
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
);

const UserModel = mongoose.model("User", UserSchema);

const find = async (query) => {
  const { paginate, page, search } = query;
  let findQuery = UserModel.find({});
  if (search && search.length > 0) {
    findQuery = findQuery.find({
      $or: [
        {
          studentId: {
            $regex: search,
            $options: "i",
          },
        },
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    });
    delete query.search;
  }
  if (paginate && page !== undefined) {
    const limit = Number(paginate);
    const skip = (Number(page) - 1) * Number(paginate);
    delete query.paginate;
    delete query.page;
    return findQuery.find(query).limit(limit).skip(skip);
  }

  return findQuery;
};

const findOne = async (query) => {
  return UserModel.findOne(query);
};

const findOneLean = async (query) => {
  return UserModel.findOne(query).lean();
};

const count = async (query) => {
  return UserModel.count(query);
};

const findById = async (id) => {
  return UserModel.findById(id);
};

const findByEmail = async (email) => {
  return UserModel.findOne({ email: email });
};

const create = async (data) => {
  const newDocument = new UserModel(data);
  return newDocument.save();
};

const update = async (id, data) => {
  return UserModel.findByIdAndUpdate(id, { $set: data }, { new: true });
};

const deleteById = async (id) => {
  return UserModel.findByIdAndDelete(id);
};

const deleteMany = async (query) => {
  return UserModel.deleteMany(query);
};

const repository = {
  find,
  findOne,
  findOneLean,
  findById,
  findByEmail,
  count,
  create,
  update,
  deleteById,
  deleteMany,
};

export default repository;
