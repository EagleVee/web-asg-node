export default class FieldHelper {
  static check(field, defaultValue = "") {
    return field ? field : defaultValue;
  }

  static checkWithRandom(field) {
    return field ? field : "123456"
  }
}
