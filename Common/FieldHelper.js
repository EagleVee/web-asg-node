export default class FieldHelper {
  static check(field) {
    return field ? field : "";
  }

  static checkWithRandom(field) {
    return field ? field : "123456"
  }
}
