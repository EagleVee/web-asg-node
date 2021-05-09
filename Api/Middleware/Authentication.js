import { TokenExpiredError } from "jsonwebtoken";
import UserRepository from "../Modules/User/UserRepository";
import ErrorHelper from "../../Common/ErrorHelper";
import HTTPException from "../../Common/HTTPException";
import { verifyJwt } from "../../Common/JwtHelper";
export default async function (req, res, next) {
  try {
    const token = req.headers.authorization;
    if (token && token.length > 0) {
      const decoded = await verifyJwt(token);
      const { id = "" } = decoded;
      const user = await UserRepository.findOneLean({ _id: id });
      if (user) {
        req.user = user;
        next();
        return;
      }
    }

    ErrorHelper.handleError(res, new HTTPException(401, "Unauthenticated"));
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      ErrorHelper.handleError(res, new HTTPException(401, "Token has expired"));
    } else {
      ErrorHelper.handleError(res, new HTTPException(401, "Unauthenticated"));
    }
  }
}
