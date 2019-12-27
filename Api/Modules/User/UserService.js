import Repository from "./UserRepository";
import Xlsx from "node-xlsx";
import lodash from "lodash";
import bcrypt from "bcrypt";
import AccessTokenRepository from "../AccessToken/AccessTokenRepository";
import { SECRET_KEY } from "../../../Config";
import ErrorHelper from "../../../Common/ErrorHelper";
import FieldHelper from "../../../Common/FieldHelper";

const find = async query => {
  return Repository.find(query);
};

const findById = async id => {
  return Repository.findById(id);
};

const create = async data => {
  if (!data || !data.studentId) {
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

const updateOrCreateStudent = async data => {
  if (!data || !data.studentId || !data.name || !data.password) {
    return null;
  }
  const existedRecord = await Repository.findOneLean({ studentId: data.studentId });
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
  let updatedStudent = [];
  for (const sheet of parsedFile) {
    const { data } = sheet;
    const fields = data.splice(0, 1)[0];
    const studentIdIndex = fields.findIndex(v => v === "studentId");
    const nameIndex = fields.findIndex(v => v === "name");
    const passwordIndex = fields.findIndex(v => v === "password");
    if (studentIdIndex === -1 || nameIndex === -1 || passwordIndex === -1) {
      ErrorHelper.invalidFileFormat();
    }
    for (const student of data) {
      const hashedPassword = await bcrypt.hash(
        FieldHelper.checkWithRandom(student[passwordIndex]),
        SECRET_KEY
      );
      const studentData = {
        username: FieldHelper.check(student[studentIdIndex]),
        studentId: FieldHelper.check(student[studentIdIndex]),
        name: FieldHelper.check(student[nameIndex]),
        password: hashedPassword,
        role: "student"
      };
      const studentRecord = await updateOrCreateStudent(studentData);
      if (studentRecord) {
        updatedStudent.push(studentRecord);
      }
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
  upload
};

export default service;
