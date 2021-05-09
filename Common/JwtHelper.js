import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../Config/index";
export function verifyJwt(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
}
