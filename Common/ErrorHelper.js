export default class ErrorHelper {
  static unauthenticated() {
    throw new Error("Unauthenticated");
  }
  static missingInput() {
    throw new Error("Missing input");
  }

  static notExisted() {
    throw new Error("Not existed");
  }

  static entityNotFound() {
    throw new Error("Entity not found");
  }

  static missingFile() {
    throw new Error("Missing file");
  }

  static invalidFileFormat() {
    throw new Error("Invalid File Format");
  }
}
