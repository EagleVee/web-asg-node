import mongoose from "mongoose";

const ClassStudentSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true
    },
    examStatus: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    }
  }
);

const ClassStudentModel = mongoose.model("ClassStudent", ClassStudentSchema);

const find = async query => {
  const { paginate, page } = query;
  if (paginate && page !== undefined) {
    const limit = Number(paginate);
    const skip = (Number(page) - 1) * Number(paginate);
    delete query.paginate;
    delete query.page;
    return ClassStudentModel.find(query)
      .limit(limit)
      .skip(skip)
      .populate("student")
      .populate("class");
  } else {
    return ClassStudentModel.find(query)
      .populate("student")
      .populate("class");
  }
};

const findOne = async query => {
  return ClassStudentModel.findOne(query)
    .populate("student")
    .populate("class");
};

const count = async query => {
  return ClassStudentModel.count(query);
};

const findById = async id => {
  return ClassStudentModel.findById(id)
    .populate("student")
    .populate("class");
};

const create = async data => {
  const newDocument = new ClassStudentModel(data);
  return newDocument.save();
};

const update = async (id, data) => {
  return ClassStudentModel.findByIdAndUpdate(id, { $set: data }, { new: true });
};

const deleteById = async id => {
  return ClassStudentModel.findByIdAndDelete(id);
};

const repository = {
  find,
  findOne,
  findById,
  count,
  create,
  update,
  deleteById
};

export default repository;