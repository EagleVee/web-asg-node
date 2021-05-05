import mongoose from "mongoose";

const StudySetSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
      default: ""
    }
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    }
  }
);

const StudySetModel = mongoose.model("StudySet", StudySetSchema);

const find = async query => {
  const { paginate, page, search } = query;
  let findQuery = StudySetModel.find({});
  if (search && search.length > 0) {
    findQuery = findQuery.find({
      $or: [
        {
          title: {
            $regex: search,
            $options: "i"
          }
        },
      ]
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

const findOne = async query => {
  return StudySetModel.findOne(query);
};

const findOneLean = async query => {
  return StudySetModel.findOne(query).lean();
};

const count = async query => {
  return StudySetModel.count(query);
};

const findById = async id => {
  return StudySetModel.findById(id);
};

const create = async data => {
  const newDocument = new StudySetModel(data);
  return newDocument.save();
};

const update = async (id, data) => {
  return StudySetModel.findByIdAndUpdate(id, { $set: data }, { new: true });
};

const deleteById = async id => {
  return StudySetModel.findByIdAndDelete(id);
};

const deleteMany = async query => {
  return StudySetModel.deleteMany(query);
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
  deleteMany
};

export default repository;