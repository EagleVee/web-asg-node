import mongoose from "mongoose";

  const ClassSchema = mongoose.Schema(
    {},
    {
      timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
      }
    }
  );
  
  const  ClassModel = mongoose.model("Class",  ClassSchema);
  
  const find = async query => {
    const { paginate, page, search } = query;
    let findQuery =  ClassModel.find({});
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
    return  ClassModel.findOne(query);
  };
  
  const findOneLean = async query => {
    return  ClassModel.findOne(query).lean();
  };
  
  const count = async query => {
    return  ClassModel.count(query);
  };
  
  const findById = async id => {
    return  ClassModel.findById(id);
  };
  
  const create = async data => {
    const newDocument = new  ClassModel(data);
    return newDocument.save();
  };
  
  const update = async (id, data) => {
    return  ClassModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  };
  
  const deleteById = async id => {
    return  ClassModel.findByIdAndDelete(id);
  };
  
  const deleteMany = async query => {
    return  ClassModel.deleteMany(query);
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