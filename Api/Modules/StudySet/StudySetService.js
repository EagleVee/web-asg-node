import Repository from "./StudySetRepository";
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
  