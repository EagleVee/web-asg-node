import Repository from "./ShiftRepository";
import ClassRepository from "../Class/ClassRepository";
import ShiftRoomRepository from "../ShiftRoom/ShiftRoomRepository";
import RoomRepository from "../Room/RoomRepository";
import ErrorHelper from "../../../Common/ErrorHelper";
import Xlsx from "node-xlsx";
import moment from "moment";

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

const updateOrCreate = async data => {
  if (!data || !data.beginAt || !data.endAt || !data.class) {
    return null;
  }
  const existedRecord = await Repository.findOneLean({
    class: data.class
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
  let updatedShift = [];
  for (const sheet of parsedFile) {
    const { data } = sheet;
    const fields = data.splice(0, 1)[0];
    const classIndex = fields.findIndex(v => v === "class");
    const dateIndex = fields.findIndex(v => v === "date");
    const beginIndex = fields.findIndex(v => v === "begin");
    const endIndex = fields.findIndex(v => v === "end");
    const roomsIndex = fields.findIndex(v => v === "rooms");

    if (
      classIndex === -1 ||
      dateIndex === -1 ||
      beginIndex === -1 ||
      endIndex === -1 ||
      roomsIndex === -1
    ) {
      ErrorHelper.invalidFileFormat();
    }
    for (const shift of data) {
      if (
        shift[classIndex] &&
        shift[dateIndex] &&
        shift[beginIndex] &&
        shift[endIndex] &&
        shift[roomsIndex]
      ) {
        const dateString = shift[dateIndex];
        const beginString = shift[beginIndex];
        const endString = shift[endIndex];
        const classCode = shift[classIndex];
        const rooms = shift[roomsIndex].split(";");
        const classRecord = await ClassRepository.findOneLean({
          code: classCode
        });
        if (!classRecord) {
          continue;
        }
        const beginUnix = moment(
          dateString + " " + beginString,
          "DD-MM-YYYY HH:mm"
        ).unix();
        const endUnix = moment(
          dateString + " " + endString,
          "DD-MM-YYYY HH:mm"
        ).unix();
        const shiftData = {
          class: classRecord._id,
          beginAt: beginUnix,
          endAt: endUnix
        };
        const shiftRecord = await Repository.create(shiftData);
        if (!shiftRecord) {
          continue;
        }
        for (const room of rooms) {
          const roomRecord = await RoomRepository.findOneLean({ name: room });
          if (roomRecord) {
            const shiftRoomData = {
              shift: shiftRecord._id,
              room: roomRecord._id,
              students: []
            };
            await ShiftRoomRepository.create(shiftRoomData);
          }
        }

        updatedShift.push(shiftRecord);
      }
    }
  }
  return updatedShift;
};

const service = {
  find,
  findById,
  create,
  update,
  deleteByID,
  upload
};

export default service;
