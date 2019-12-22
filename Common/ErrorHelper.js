export default class ErrorHelper {
  static missingInput = () => {
    throw new Error("Missing input");
  }

  static notExisted = () => {
    throw new Error("Not existed");
  }

  static entityNotFound = () => {
    throw new Error("Entity not found");
  }

  static
}