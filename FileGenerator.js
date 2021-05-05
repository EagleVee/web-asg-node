const fs = require("fs");

const repositoryContent = fileName => {
  return `import mongoose from "mongoose";

  const ${fileName}Schema = mongoose.Schema(
    {},
    {
      timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
      }
    }
  );
  
  const  ${fileName}Model = mongoose.model("${fileName}",  ${fileName}Schema);
  
  const find = async query => {
    const { paginate, page, search } = query;
    let findQuery =  ${fileName}Model.find({});
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
    return  ${fileName}Model.findOne(query);
  };
  
  const findOneLean = async query => {
    return  ${fileName}Model.findOne(query).lean();
  };
  
  const count = async query => {
    return  ${fileName}Model.count(query);
  };
  
  const findById = async id => {
    return  ${fileName}Model.findById(id);
  };
  
  const create = async data => {
    const newDocument = new  ${fileName}Model(data);
    return newDocument.save();
  };
  
  const update = async (id, data) => {
    return  ${fileName}Model.findByIdAndUpdate(id, { $set: data }, { new: true });
  };
  
  const deleteById = async id => {
    return  ${fileName}Model.findByIdAndDelete(id);
  };
  
  const deleteMany = async query => {
    return  ${fileName}Model.deleteMany(query);
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
  
  export default repository;`;
};

const serviceContent = fileName => {
  return `import Repository from "./${fileName}Repository";
  import ErrorHelper from "../../../Common/ErrorHelper";
  import FieldHelper from "../../../Common/FieldHelper";
  
  const find = async query => {
    return Repository.find(query);
  };
  
  const findById = async id => {
    return Repository.findById(id);
  };
  
  const create = async data => {
    return Repository.create(data);
  };
  
  const update = async function(id, data) {
    const existedRecord = await Repository.findById(id);
    if (!existedRecord) {
      ErrorHelper.entityNotFound();
    }
  
    return Repository.update(id, data);
  };
  
  const deleteByID = async id => {
    const existedRecord = await Repository.findById(id);
    if (!existedRecord) {
      ErrorHelper.entityNotFound();
    }
  
    return Repository.delete(id);
  };

  const updateOrCreateStudent = async data => {
    const existedRecord = await Repository.findOneLean({
    });
    if (!existedRecord) {
      return Repository.create(data);
    }
    return Repository.update(existedRecord._id, data);
  };
  
  const service = {
    find,
    findById,
    create,
    update,
    deleteByID,
  };
  
  export default service;
  `;
}

const routerContent = fileName => {
  return `import Express from "express";
  import Service from "./${fileName}Service";
  import ResponseJSON from "../../../Config/ResponseJSON";
  import ErrorHelper from "../../../Common/ErrorHelper";
  
  const Router = Express.Router();
  
  Router.get("/", async function(req, res) {
    try {
      const data = await Service.find(req.query);
      res.status(200).send(ResponseJSON.success(data));
    } catch (err) {
      ErrorHelper.handleError(res, err);
    }
  });
  
  Router.get("/:id", async function(req, res) {
    try {
      const data = await Service.findById(req.params.id);
      res.status(200).send(ResponseJSON.success(data));
    } catch (err) {
      ErrorHelper.handleError(res, err);
    }
  });
  
  Router.post("/", async function(req, res) {
    try {
      const data = await Service.create(req.body);
      res.status(200).send(ResponseJSON.success(data));
    } catch (err) {
      ErrorHelper.handleError(res, err);
    }
  });
  
  Router.put("/:id", async function(req, res) {
    try {
      const data = await Service.update(req.params.id, req.body);
      res.status(200).send(ResponseJSON.success(data));
    } catch (err) {
      ErrorHelper.handleError(res, err);
    }
  });
  
  Router.delete("/:id", async function(req, res) {
    try {
      const data = await Service.deleteByID(req.params.id);
      res.status(200).send(ResponseJSON.success(data));
    } catch (err) {
      ErrorHelper.handleError(res, err);
    }
  });
  
  export default Router;`;
}

function createModule(fileName) {
  let dirPath = `Api/Modules/${fileName}`;
  console.log("MAKING DIR", dirPath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
  const repositoryPath = dirPath + `/${fileName}Repository.js`;
  const servicePath = dirPath + `/${fileName}Service.js`;
  const routerPath = dirPath + `/${fileName}Router.js`;
  if (fs.existsSync(repositoryPath) || fs.existsSync(servicePath) || fs.existsSync(routerPath)) {
    throw new Error("File existed!");
  } else {
    const repository = repositoryContent(fileName);
    const service = serviceContent(fileName);
    const router = routerContent(fileName);
    writeToOutput(repositoryPath, repository);
    writeToOutput(servicePath, service);
    writeToOutput(routerPath, router);
  }
}

function writeToOutput(fileOutput, content) {
  const outputWriteStream = fs.createWriteStream(fileOutput);
  outputWriteStream.write(content);
}

const createFile = () => {
  const args = process.argv.slice(2);
  const type = args[0];
  const name = args[1];
  if (type && name) {
    switch (type) {
      case "module":
        createModule(name);
        break;
    }
  } else {
    throw new Error("Missing type or file name");
  }
};

createFile();