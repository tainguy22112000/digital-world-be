import express from 'express'
import { userController } from './user.controller'
import { limitRequests, verifyAccessToken } from '@/middlewares'

const router = express.Router()

router.get('/users/list', verifyAccessToken, limitRequests, userController.list)

export = router
