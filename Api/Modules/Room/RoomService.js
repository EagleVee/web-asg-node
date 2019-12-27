import Repository from "./RoomRepository";
import AccessTokenRepository from "../AccessToken/AccessTokenRepository";
import ErrorHelper from "../../../Common/ErrorHelper";
import Xlsx from "node-xlsx";
import bcrypt from "bcrypt";
import FieldHelper from "../../../Common/FieldHelper";
import { SECRET_KEY } from "../../../Config";

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

const updateOrCreate = async data => {
  if (!data || !data.name || !data.seat) {
    return null;
  }
  const existedRecord = await Repository.findOneLean({ name: data.name });
  if (!existedRecord) {
    return Repository.create(data);
  }
  return Repository.update(existedRecord._id, data);
};

const upload = async req => {
  const { file } = req;
  if (!file) {
    ErrorHelper.missingFile();
  }
  const parsedFile = Xlsx.parse(file.path);
  let room = [];
  for (const sheet of parsedFile) {
    const { data } = sheet;
    const fields = data.splice(0, 1)[0];
    const nameIndex = fields.findIndex(v => v === "name");
    const seatIndex = fields.findIndex(v => v === "seat");
    if (seatIndex === -1 || nameIndex === -1) {
      ErrorHelper.invalidFileFormat();
    }
    for (const room of data) {
      const roomData = {
        name: FieldHelper.check(room[nameIndex]),
        seat: FieldHelper.check(room[seatIndex])
      };
      const roomRecord = await updateOrCreate(roomData);
      if (roomRecord) {
        room.push(roomRecord);
      }
    }
  }
  return room;
};

const service = {
  find,
  findById,
  findByToken,
  create,
  update,
  deleteByID,
  upload,
  updateOrCreate
};

export default service;
