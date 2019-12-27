import Repository from "./ClassRepository";
import AccessTokenRepository from "../AccessToken/AccessTokenRepository";
import ErrorHelper from "../../../Common/ErrorHelper";
import Xlsx from "node-xlsx";
import UserRepository from "../User/UserRepository";
import FieldHelper from "../../../Common/FieldHelper";
const find = async query => {
  return Repository.find(query);
};

const findById = async id => {
  return Repository.findById(id);
};

const create = async data => {
  if (!data) {
    ErrorHelper.missingInput();
  }

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

const validateEmail = email => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const updateOrCreate = async data => {
  if (!data || !data.code || !data.name || !data.lecturer) {
    return null;
  }
  const existedRecord = await Repository.findOneLean({
    code: data.code
  });
  if (!existedRecord) {
    return Repository.create(data);
  }

  return Repository.update(existedRecord._id, data);
};

const upload = async data => {
  const { file } = data;
  if (!file) {
    ErrorHelper.missingFile();
  }
  const parsedFile = Xlsx.parse(file.path);
  let updatedClass = [];
  for (const sheet of parsedFile) {
    const { data } = sheet;
    const fields = data.splice(0, 1)[0];
    const codeIndex = fields.findIndex(v => v === "code");
    const nameIndex = fields.findIndex(v => v === "name");
    const lecturerIndex = fields.findIndex(v => v === "lecturer");
    if (codeIndex === -1 || nameIndex === -1 || lecturerIndex === -1) {
      ErrorHelper.invalidFileFormat();
    }
    for (const _class of data) {
      if (_class[codeIndex] && _class[nameIndex] && _class[lecturerIndex]) {
        const classData = {
          code: FieldHelper.check(_class[codeIndex]),
          name: FieldHelper.check(_class[nameIndex]),
          lecturer: FieldHelper.check(_class[lecturerIndex])
        };
        const classRecord = await updateOrCreate(classData);
        if (classRecord) {
          updatedClass.push(classRecord);
        }
      }
    }
  }
  return updatedClass;
};

const service = {
  find,
  findById,
  create,
  update,
  upload,
  deleteByID
};

export default service;
