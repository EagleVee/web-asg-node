import Repository from "./UserRepository";
import Xlsx from "node-xlsx";
import lodash from "lodash";
import bcrypt from "bcrypt";
import AccessTokenRepository from "../AccessToken/AccessTokenRepository";
import { SECRET_KEY } from "../../../Config";

const find = async query => {
  return Repository.find(query);
};

const findById = async id => {
  return Repository.findById(id);
};

const create = async data => {
  if (!data || !data.studentId) {
    throw new Error("Missing input!");
  }

  return Repository.create(data);
};

const update = async function(id, data) {
  const existedRecord = await Repository.findById(id);
  if (!existedRecord) {
    throw new Error("Entity not found!");
  }

  return Repository.update(id, data);
};

const deleteByID = async id => {
  const existedRecord = await Repository.findById(id);
  if (!existedRecord) {
    throw new Error("Entity not found!");
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

const updateOrCreateStudent = async data => {
  if (!data || !data.studentId) {
    throw new Error("Missing info");
  }
  const existedRecord = await Repository.findOne({ studentId: data.studentId });
  if (!existedRecord) {
    return Repository.create(data);
  }
  return Repository.update(existedRecord._id, data);

};

const updateStudentList = async data => {
  const { file } = data;
  if (!file) {
    throw new Error("Missing file");
  }
  const parsedFile = Xlsx.parse(file.path);
  let updatedStudent = [];
  for (const sheet of parsedFile) {
    const { data } = sheet;
    for (const student of data) {
      const studentId = student[1] ? student[1] : "";
      const name = student[2] ? student[2] : "";
      const hashedPassword = await bcrypt.hash(student[3], SECRET_KEY);
      const studentRecord = {
        studentId: studentId,
        name: name,
        password: hashedPassword
      };
      const newRecord = await updateOrCreateStudent(studentRecord);
      updatedStudent.push(newRecord);
    }
  }
  return updatedStudent;
};

const service = {
  find,
  findById,
  findByToken,
  create,
  update,
  deleteByID,
  updateStudentList
};

export default service;
