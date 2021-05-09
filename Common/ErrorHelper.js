import HTTPException from "./HTTPException";
import ResponseJSON from "../Config/ResponseJSON";
export default class ErrorHelper {
  static unauthenticated() {
    throw new HTTPException(403, "Unauthenticated");
  }
  static missingInput() {
    throw new HTTPException(400, "Missing input");
  }

  static notExisted() {
    throw new HTTPException(400, "Not existed");
  }

  static entityNotFound() {
    throw new HTTPException(400, "Entity not found");
  }

  static handleError(res, error) {
    if (error instanceof HTTPException) {
      res.status(error.statusCode).send(ResponseJSON.failed(error.message));
    } else {
      res.status(400).send(ResponseJSON.failed(error.message));
    }
  }
}
