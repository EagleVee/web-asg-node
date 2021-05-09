import mongoose from "mongoose";

const TestResultSchema = mongoose.Schema(
  {},
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
);

const TestResultModel = mongoose.model("TestResult", TestResultSchema);

const find = async (query) => {
  const { paginate, page, search } = query;
  let findQuery = TestResultModel.find({});
  if (search && search.length > 0) {
    findQuery = findQuery.find({
      $or: [
        {
          title: {
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
  return TestResultModel.findOne(query);
};

const findOneLean = async (query) => {
  return TestResultModel.findOne(query).lean();
};

const count = async (query) => {
  return TestResultModel.count(query);
};

const findById = async (id) => {
  return TestResultModel.findById(id);
};

const create = async (data) => {
  const newDocument = new TestResultModel(data);
  return newDocument.save();
};

const update = async (id, data) => {
  return TestResultModel.findByIdAndUpdate(id, { $set: data }, { new: true });
};

const deleteById = async (id) => {
  return TestResultModel.findByIdAndDelete(id);
};

const deleteMany = async (query) => {
  return TestResultModel.deleteMany(query);
};

const repository = {
  find,
  findOne,
  findOneLean,
  findById,
  count,
  create,
  update,
  deleteById,
  deleteMany,
};

export default repository;
