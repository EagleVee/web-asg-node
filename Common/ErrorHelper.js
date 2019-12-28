export default class ErrorHelper {
  static unauthenticated() {
    throw new Error("Bạn không có quyền truy cập");
  }
  static missingInput() {
    throw new Error("Thiếu thông tin");
  }

  static notExisted() {
    throw new Error("Not existed");
  }

  static entityNotFound() {
    throw new Error("Không tìm thấy");
  }

  static missingFile() {
    throw new Error("Thiếu file");
  }

  static invalidFileFormat() {
    throw new Error("Định dạng file không đúng");
  }
}
