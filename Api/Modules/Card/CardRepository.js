import mongoose from "mongoose";

  const CardSchema = mongoose.Schema(
    {},
    {
      timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
      }
    }
  );
  
  const  CardModel = mongoose.model("Card",  CardSchema);
  
  const find = async query => {
    const { paginate, page, search } = query;
    let findQuery =  CardModel.find({});
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
    return  CardModel.findOne(query);
  };
  
  const findOneLean = async query => {
    return  CardModel.findOne(query).lean();
  };
  
  const count = async query => {
    return  CardModel.count(query);
  };
  
  const findById = async id => {
    return  CardModel.findById(id);
  };
  
  const create = async data => {
    const newDocument = new  CardModel(data);
    return newDocument.save();
  };
  
  const update = async (id, data) => {
    return  CardModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  };
  
  const deleteById = async id => {
    return  CardModel.findByIdAndDelete(id);
  };
  
  const deleteMany = async query => {
    return  CardModel.deleteMany(query);
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