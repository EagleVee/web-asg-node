import Repository from "./ClassStudentRepository";
import AccessTokenRepository from "../AccessToken/AccessTokenRepository";
import ErrorHelper from "../../../Common/ErrorHelper";
import Xlsx from "node-xlsx";

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

const findByToken = async jwtToken => {
  const token = await AccessTokenRepository.findByToken(jwtToken);
  return token.user;
};

const updateOrCreateClassStudent = async data => {
  if (!data || !data.student || !data.class) {
    ErrorHelper.missingInput();
  }

  const existedRecord = Repository.findOne({
    student: data.student,
    class: data.class
  });
  if (!existedRecord) {
    return Repository.create(data);
  }

  return Repository.update(existedRecord._id, data);
};

const updateClassStudent = async data => {
  const { file } = data;
  if (!file) {
    ErrorHelper.missingFile();
  }

  const parsedFile = Xlsx.parse(file);
  for(const sheet of parsedFile) {
    const { data } = sheet;
    for (const student of data) {

    }
  }

};

const service = {
  find,
  findById,
  findByToken,
  create,
  update,
  deleteByID
};

export default service;
