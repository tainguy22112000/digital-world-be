import { Request } from 'express'
import JWT from 'jsonwebtoken'

interface IUserRegister {
  email: string
  password: string
}

interface IToken {
  refreshToken: string
  accessToken: string
}

interface IAuthRequest extends Request {
  headers: { authorization?: string; Authorization?: string }
  cookies: { authToken?: string; accessToken?: string; refreshToken?: string }
  payload?: string | JWT.JwtPayload
}

export { IAuthRequest, IToken, IUserRegister }
