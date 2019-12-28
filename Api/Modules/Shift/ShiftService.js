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

  const _data = await validateData(data);

  const shiftRecord = await Repository.create(_data);

  await createRooms(shiftRecord._id, _data);

  return shiftRecord;
};

const createRooms = async (shiftId, data) => {
  if (data.rooms) {
    for (const room of data.rooms) {
      const roomRecord = await RoomRepository.findOneLean({ name: room });
      if (roomRecord) {
        const shiftRoomData = {
          shift: shiftId,
          room: roomRecord._id,
          students: []
        };
        await ShiftRoomRepository.create(shiftRoomData);
      } else {
        throw new Error("Không tìm thấy phòng thi");
      }
    }
  }
};

const updateRooms = async (shiftId, data) => {
  if (data.rooms) {
    for (const room of data.rooms) {
      const roomRecord = await RoomRepository.findOneLean({ name: room });
      if (!roomRecord) {
        throw new Error("Không tìm thấy phòng thi");
      }
      const shiftRoomRecord = await ShiftRoomRepository.findOneLean({
        shift: shiftId,
        room: roomRecord._id
      });

      if (!shiftRoomRecord) {
        await ShiftRoomRepository.create({
          shift: shiftId,
          room: roomRecord._id,
          students: []
        });
      }
    }
  }
};

const update = async function(id, data) {
  const existedRecord = await Repository.findById(id);
  if (!existedRecord) {
    ErrorHelper.entityNotFound();
  }

  const _data = await validateData(data);

  await updateRooms(id, _data);

  return Repository.update(id, _data);
};

const validateData = async (data, next) => {
  if (data.code) {
    const classRecord = await ClassRepository.findOneLean({ code: data.code });
    if (classRecord) {
      data.class = classRecord._id;
    } else {
      if (next) {
        next();
        return null;
      }
      throw new Error("Không tìm thấy mã lớp học phần");
    }
  }

  const classShifts = await Repository.findLean({ class: data.class });
  for (const shift of classShifts) {
    const { beginAt, endAt } = shift;
    if (data.beginAt < endAt || data.endAt < beginAt) {
      if (next) {
        next();
        return null;
      }
      throw new Error("Đã có ca thi khác trong khung giờ này");
    }
  }

  return data;
};

const deleteByID = async id => {
  const existedRecord = await Repository.findById(id);
  if (!existedRecord) {
    ErrorHelper.entityNotFound();
  }

  return Repository.delete(id);
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
        const _data = await validateData(shiftData, () => {});
        if (!_data) {
          continue;
        }
        const shiftRecord = await Repository.create(_data);
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
