import mongoose from "mongoose";

  const FolderSchema = mongoose.Schema(
    {},
    {
      timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
      }
    }
  );
  
  const  FolderModel = mongoose.model("Folder",  FolderSchema);
  
  const find = async query => {
    const { paginate, page, search } = query;
    let findQuery =  FolderModel.find({});
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
    return  FolderModel.findOne(query);
  };
  
  const findOneLean = async query => {
    return  FolderModel.findOne(query).lean();
  };
  
  const count = async query => {
    return  FolderModel.count(query);
  };
  
  const findById = async id => {
    return  FolderModel.findById(id);
  };
  
  const create = async data => {
    const newDocument = new  FolderModel(data);
    return newDocument.save();
  };
  
  const update = async (id, data) => {
    return  FolderModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  };
  
  const deleteById = async id => {
    return  FolderModel.findByIdAndDelete(id);
  };
  
  const deleteMany = async query => {
    return  FolderModel.deleteMany(query);
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