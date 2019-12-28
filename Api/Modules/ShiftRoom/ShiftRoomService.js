import Repository from "./ShiftRoomRepository";
import ShiftRepository from "../Shift/ShiftRepository";

import ErrorHelper from "../../../Common/ErrorHelper";

const find = async query => {
  if (query.class) {
    const shifts = await ShiftRepository.findLean({
      class: query.class
    });
    let result = [];

    if (!shifts.length || shifts.length === 0) {
      return result;
    }
    for (const shift of shifts) {
      const shiftRooms = await Repository.findLean({
        shift: shift._id
      });
      if (!shiftRooms.length || shiftRooms.length === 0) {
        continue;
      }
      for (const shiftRoom of shiftRooms) {
        const { room, students } = shiftRoom;
        if (!room || !students) {
          continue;
        }
        if (query.student) {
          shiftRoom.registered =
            shiftRoom.students.findIndex(v => v.toString() === query.student) >=
            0;
        }

        const { seat } = room;
        shiftRoom.available = students.length < seat;
        result.push(shiftRoom);
      }
    }

    return result;
  }

  return Repository.find(query);
};

const findAllRooms = async id => {
  return result;
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

  // if (data.newStudent) {
  //   const { _id } = newStudent;
  // }

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

const studentRegister = async data => {
  console.log(data);
  if (
    !data ||
    !data.student ||
    !data.shift ||
    !data.newRoom ||
    data.register === null ||
    data.register === undefined
  ) {
    ErrorHelper.missingInput();
  }
  const { student, shift, newRoom, register } = data;

  const shiftRoomRecords = await Repository.findLean({
    shift: shift
  });

  for (let shiftRoom of shiftRoomRecords) {
    const { _id, students, room } = shiftRoom;
    if (newRoom === room._id.toString()) {
      if (register) {
        students.push(student);
      } else {
        const index = students.findIndex(v => v === student);
        students.splice(index, 1);
      }
      await Repository.update(_id, shiftRoom);
    } else {
      const index = students.findIndex(v => v === student);
      if (index >= 0) {
        students.splice(index, 1);
        await Repository.update(_id, shiftRoom);
      }
    }
  }

  return {
    updated: true
  };
};

const service = {
  find,
  findById,
  findAllRooms,
  create,
  update,
  deleteByID,
  studentRegister
};

export default service;
