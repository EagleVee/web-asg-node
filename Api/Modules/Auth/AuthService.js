import bcrypt from "bcrypt";
import jwt, { TokenExpiredError } from "jsonwebtoken";

import UserRepository from "../User/UserRepository";

import { JWT_SECRET, SECRET_KEY } from "../../../Config";
import ResponseJSON from "../../../Config/ResponseJSON";
import ErrorHelper from "../../../Common/ErrorHelper";
import HTTPException from "../../../Common/HTTPException";
import { verifyJwt } from "../../../Common/JwtHelper";

const login = async (data) => {
  if (!data.username || !data.password) {
    ErrorHelper.missingInput();
  }
  const existedUser = await UserRepository.findOne({ username: data.username });
  if (!existedUser) {
    throw new HTTPException(401, "This email has not been registered!");
  }

  const result = await bcrypt.compare(data.password, existedUser.password);
  if (result) {
    return generateTokens({ id: existedUser._id });
  } else {
    throw new HTTPException(403, "You have entered wrong password!");
  }
};

const register = async (data) => {
  const { password, email, googleId = "", facebookId = "" } = data;
  if (!password || !email) {
    ErrorHelper.missingInput();
  }
  const existedUser = await UserRepository.findByEmail(data.email);
  if (existedUser) {
    throw new HTTPException(
      401,
      "An user with this email has already been registerd",
    );
  }
  const hashedPassword = await bcrypt.hash(data.password, SECRET_KEY);
  const user = await UserRepository.create({
    email: email,
    googleId: googleId,
    facebookId: facebookId,
    password: hashedPassword,
  });
  return generateTokens({ id: user._id });
};

const generateTokens = (params) => {
  const accessToken = jwt.sign(params, JWT_SECRET, {
    expiresIn: "1 hours",
  });

  const refreshToken = jwt.sign(params, JWT_SECRET, {
    expiresIn: "30 days",
  });

  return {
    accessToken,
    refreshToken,
  };
};

const authorization = (user, roles) => {
  return user && roles.indexOf(user.role) >= 0;
};

const refreshToken = async (token) => {
  try {
    const decoded = await verifyJwt(token);
    return generateTokens({ id: decoded.id });
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new HTTPException(401, "Token has expired");
    } else {
      throw new HTTPException(401, "Invalid refresh token");
    }
  }
};

const service = {
  login,
  register,
  authorization,
  refreshToken,
};

export default service;
