import Repository from "./ShiftRepository";
import ClassRepository from "../Class/ClassRepository";
import ShiftRoomRepository from "../ShiftRoom/ShiftRoomRepository";
import RoomRepository from "../Room/RoomRepository";
import ErrorHelper from "../../../Common/ErrorHelper";

const find = async query => {
  let list = await Repository.findLean(query);
  let result = [];
  for (let shift of list) {
    const shiftRooms = await ShiftRoomRepository.findLean({ shift: shift._id });
    if (shiftRooms.length > 0) {
      Object.assign(shift, {
        rooms: shiftRooms
      });
    } else {
      Object.assign(shift, {
        rooms: []
      });
    }
    result.push(shift);
  }

  return result;
};

const findById = async id => {
  return Repository.findById(id);
};

const create = async data => {
  if (!data || !data.beginAt || !data.endAt) {
    ErrorHelper.missingInput();
  }

  if (data.code) {
    const classRecord = await ClassRepository.findOneLean({ code: data.code });
    if (classRecord) {
      data.class = classRecord._id;
    } else {
      throw new Error("Không tìm thấy mã lớp học phần");
    }
  }

  const shiftRecord = await Repository.create(data);
  console.log(data);
  if (data.rooms) {
    for (const room of data.rooms) {
      const roomRecord = await RoomRepository.findOneLean({ name: room });
      if (roomRecord) {
        const shiftRoomData = {
          shift: shiftRecord._id,
          room: roomRecord._id,
          students: []
        };
        const shiftRoomRecord = await ShiftRoomRepository.create(shiftRoomData);
      } else {
        throw new Error("Không tìm thấy phòng thi");
      }
    }
  }

  return shiftRecord;
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

const service = {
  find,
  findById,
  create,
  update,
  deleteByID
};

export default service;
