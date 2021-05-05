import HTTPException from "./HTTPException";
import ResponseJSON from "../Config/ResponseJSON"
export default class ErrorHelper {
  static unauthenticated() {
    throw new HTTPException(401, "Bạn không có quyền truy cập");
  }
  static missingInput() {
    throw new HTTPException(400, "Thiếu thông tin");
  }

  static notExisted() {
    throw new HTTPException(400, "Not existed");
  }

  static entityNotFound() {
    throw new HTTPException(400, "Không tìm thấy");
  }

  static missingFile() {
    throw new HTTPException(400, "Thiếu file");
  }

  static invalidFileFormat() {
    throw new HTTPException(400, "Định dạng file không đúng");
  }

  static handleError(res, error) {
    if (error instanceof HTTPException) {
      res.status(error.statusCode).send(ResponseJSON.failed(error.message));
    } else {
      res.status(400).send(ResponseJSON.failed(error.message))
    }
  }
}