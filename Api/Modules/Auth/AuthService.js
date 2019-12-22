import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserRepository from "../User/UserRepository";
import AccessTokenRepository from "../AccessToken/AccessTokenRepository";

import {
  JWT_SECRET,
  SECRET_KEY,
  TOKEN_EXPIRE_MILLISECOND
} from "../../../Config";
import ResponseJSON from "../../../Config/ResponseJSON";

const login = async data => {
  if (!data.username || !data.password) {
    ErrorHelper.missingInput();
  }
  const existedUser = await UserRepository.findOne({ username: data.username });
  if (!existedUser) {
    throw new Error("This email has not been registered!");
  }

  const result = await bcrypt.compare(data.password, existedUser.password);
  if (result) {
    const tokenData = {
      _id: existedUser._id,
      name: existedUser.name,
      email: existedUser.email,
      role: existedUser.role
    };

    const accessToken = await jwt.sign(tokenData, JWT_SECRET, {
      expiresIn: "7 days"
    });

    const expireAt = Date.now() + TOKEN_EXPIRE_MILLISECOND;

    const accessTokenData = await AccessTokenRepository.create({
      user: existedUser._id,
      jwtToken: accessToken,
      expiredAt: expireAt
    });

    return {
      user: existedUser,
      accessToken: accessToken
    };
  } else {
    throw new Error("You have entered wrong password!");
  }
};

const register = async data => {
  if (!data.studentId || !data.password || !data.name) {
    ErrorHelper.missingInput();
  }
  const existedUser = await UserRepository.findByEmail(data.email);
  if (existedUser) {
    throw new Error("USER EXISTED!");
  }
  const hashedPassword = await bcrypt.hash(data.password, SECRET_KEY);
  return UserRepository.create({
    name: data.name,
    studentId: data.studentId,
    password: hashedPassword
  });
};

const validateToken = async token => {
  const existedToken = await AccessTokenRepository.findByToken(token);
  if (!existedToken) {
    throw new Error("Invalid token!");
  }
  if (existedToken.expiredAt < Date.now()) {
    throw new Error("Token expired!");
  }
  const newExpireDate = Date.now() + TOKEN_EXPIRE_MILLISECOND;
  return await AccessTokenRepository.updateExpireAt(token, newExpireDate);
};

const logoutToken = async token => {
  const existedToken = await AccessTokenRepository.findByToken(token);
  if (!existedToken) {
    throw new Error("Invalid token!");
  }
  const newExpireDate = Date.now();
  const newToken = await AccessTokenRepository.updateExpireAt(
    token,
    newExpireDate
  );
  return {
    loggedOut: true
  };
};

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const accessToken = AccessTokenRepository.findByToken(token);
    if (!accessToken) {
      res.status(200).send(ResponseJSON("Invalid token!"));
    }
    if (accessToken.expire_at <= Date.now()) {
      res.status(200).send(ResponseJSON("Token expired!"));
    }
    req.user = accessToken.user;
    next();
  } catch (err) {
    res.status(200).send(ResponseJSON("Unauthenticated!"));
  }
};

const authorization = (user, roles) => {
  return !!(user && roles.indexOf(user.role) >= 0);
};

// const refreshToken = async (token) => {
//   const newExpireDate = Date.now() + TOKEN_EXPIRE_MILLISECOND
//   return AccessTokenRepository.updateExpireAt(token, newExpireDate)
// }

const service = {
  login,
  register,
  authentication,
  authorization,
  validateToken,
  logoutToken
};

export default service;
