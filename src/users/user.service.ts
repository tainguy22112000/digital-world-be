import createHttpError from 'http-errors'
import { TDeleteUser, TUpdateUser } from './user.interface'
import UserModel from './user.model'

const userService = {
  getAllUsers: async () => {
    const user = await UserModel.find().select('-password -role')

    if (!user) {
      return { code: 404, message: 'User not found' }
    }
    return { code: 200, user }
  },

  getUserInformation: async (id: string) => {
    if (!id) {
      return { code: 404, message: 'Invalid user ID' }
    }
    const info = await UserModel.findById(id)
    if (!info) {
      return { code: 404, message: 'User not found' }
    }

    return { code: 200, user: info }
  },
  updateUser: async ({
    id,
    firstName,
    lastName,
    gender,
    address,
    phoneNumber,
    bio
  }: TUpdateUser) => {
    if (!id) {
      throw createHttpError.NotFound()
    }

    const user = await UserModel.findById(id)

    if (!user) {
      throw createHttpError.BadRequest('User not found')
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { firstName, lastName, gender, address, phoneNumber, bio },
      { returnOriginal: false, new: true }
    ).select('-password -role')

    return {
      code: 200,
      message: 'User is updated',
      data: updatedUser
    }
  },
  deleteUser: async (id: string) => {
    const user = await UserModel.findById(id)

    if (!id || !user) {
      throw createHttpError.NotFound('User not found')
    }

    const deletedUser = await UserModel.findByIdAndDelete(id).select(
      'firstName'
    )

    console.log({ deletedUser })

    if (!deletedUser) {
      throw createHttpError.NotFound('No user delete')
    }

    return {
      code: 200,
      message: `${deletedUser.firstName} is deleted`
    }
  }
}

export default userService
