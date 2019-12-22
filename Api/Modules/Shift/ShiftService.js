import Repository from "./ShiftRepository";
import AccessTokenRepository from "../AccessToken/AccessTokenRepository";

const find = async query => {
  return Repository.find(query);
};

const findById = async id => {
  return Repository.findById(id);
};

const create = async data => {
  if (!data) {
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

const findByToken = async jwtToken => {
  const token = await AccessTokenRepository.findByToken(jwtToken);
  return token.user;
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
