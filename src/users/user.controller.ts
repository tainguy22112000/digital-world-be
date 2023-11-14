import { NextFunction, Request, Response } from 'express'
import UserModel from './user.model'

export const userController = {
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await UserModel.find()
      res.status(200).json({ user, numberRequest: req.body })
    } catch (err) {
      next(err)
    }
  }
}
