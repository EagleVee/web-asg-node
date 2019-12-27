import Repository from "./ClassStudentRepository";
import UserRepository from "../User/UserRepository";
import ClassRepository from "../Class/ClassRepository";
import AccessTokenRepository from "../AccessToken/AccessTokenRepository";
import ErrorHelper from "../../../Common/ErrorHelper";
import Xlsx from "node-xlsx";
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
  if (!data || !data.student || !data.class) {
    return null;
  }

  const existedRecord = await Repository.findOneLean({
    student: data.student,
    class: data.class
  });
  if (!existedRecord) {
    return Repository.create(data);
  }

  return Repository.update(existedRecord._id, data);
};

const upload = async (id, req) => {
  const { file, body } = req;
  const { status } = body;
  if (!file) {
    ErrorHelper.missingFile();
  }
  if (!status) {
    throw new Error("Please identify exam status");
  }
  const classRecord = await ClassRepository.findById(id);
  if (!classRecord) {
    throw new Error("Cannot find class");
  }
  const parsedFile = Xlsx.parse(file.path);
  let updatedClassStudent = [];
  const sheet = parsedFile[0];
  const { data } = sheet;
  const fields = data.splice(0, 1)[0];
  const studentIdIndex = fields.findIndex(v => v === "studentId");
  if (studentIdIndex === -1) {
    ErrorHelper.invalidFileFormat();
  }
  await Repository.deleteMany({ class: id });
  for (const student of data) {
    const studentRecord = await UserRepository.findOneLean({
      studentId: student[studentIdIndex]
    });
    if (studentRecord) {
      const classStudent = {
        student: studentRecord._id,
        class: classRecord._id,
        examStatus: status
      };

      const classStudentRecord = await updateOrCreate(classStudent);
      if (classStudentRecord) {
        updatedClassStudent.push(classStudentRecord);
      }
    }
  }
  return updatedClassStudent;
};

const service = {
  find,
  findById,
  upload,
  create,
  update,
  deleteByID
};

export default service;
