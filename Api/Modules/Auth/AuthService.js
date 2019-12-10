import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import UserRepository from '../User/UserRepository'
import AccessTokenRepository from '../AccessToken/AccessTokenRepository'

import { JWT_SECRET, SECRET_KEY, TOKEN_EXPIRE_MILLISECOND } from '../../../Config'
import ResponseJSON from '../../../Config/ResponseJSON'

const login = async (data) => {
  if (!data.email || !data.password) {
    throw new Error('Missing input!')
  }
  const existedUser = await UserRepository.findByEmail(data.email)
  if (!existedUser) {
    throw new Error('This email has not been registered!')
  }

  const result = await bcrypt.compare(data.password, existedUser.password)
  if (result) {
    const tokenData = {
      _id: existedUser._id,
      name: existedUser.name,
      email: existedUser.email,
      role: existedUser.role
    }

    const accessToken = await jwt.sign(tokenData, JWT_SECRET, {
      expiresIn: '7 days'
    })

    const expireAt = Date.now() + 7 * 24 * 60 * 60 * 1000

    const accessTokenData = await AccessTokenRepository.create({
      user: existedUser._id,
      jwt_token: accessToken,
      expired_at: expireAt
    })

    return {
      user: existedUser,
      access_token: accessToken
    }
  } else {
    throw new Error('You have entered wrong password!')
  }
}

const register = async (data) => {
  if (!data.email || !data.password || !data.first_name || !data.last_name) {
    throw new Error('MISSING INPUT!')
  }
  const existedUser = await UserRepository.findByEmail(data.email)
  if (existedUser) {
    throw new Error('USER EXISTED!')
  }
  const newPassword = await bcrypt.hash(data.password, SECRET_KEY)
  return UserRepository.create({
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    password: newPassword
  })
}

const validateToken = async (token) => {
  const existedToken = await AccessTokenRepository.findByToken(token)
  if (!existedToken) {
    throw new Error('Invalid token!')
  }
  if (existedToken.expired_at < Date.now()) {
    throw new Error('Token expired!')
  }
  const newExpireDate = Date.now() + TOKEN_EXPIRE_MILLISECOND
  const newToken = await AccessTokenRepository.updateExpireAt(token, newExpireDate)
  const { user } = existedToken
  return {
    user: user
  }
}

const logoutToken = async (token) => {
  const existedToken = await AccessTokenRepository.findByToken(token)
  if (!existedToken) {
    throw new Error('Invalid token!')
  }
  const newExpireDate = Date.now()
  const newToken = await AccessTokenRepository.updateExpireAt(token, newExpireDate)
  return {
    logged_out: true
  }
}

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const accessToken = AccessTokenRepository.findByToken(token)
    if (!accessToken) {
      res.status(200).send(ResponseJSON('Invalid token!'))
    }
    if (accessToken.expire_at <= Date.now()) {
      res.status(200).send(ResponseJSON('Token expired!'))
    }
    req.user = accessToken.user
    next()
  } catch (err) {
    res.status(200).send(ResponseJSON('Unauthenticated!'))
  }
}

const authorization = (user, roles) => {
  return !!(user && roles.indexOf(user.role) >= 0)
}

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
}

export default service
