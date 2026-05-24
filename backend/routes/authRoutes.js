import express from 'express'
import { loginInstructor, logoutInstructor } from '../controllers/authController.js'

const authRouter = express.Router()

authRouter.post('/login', loginInstructor)
authRouter.post('/logout', logoutInstructor)

export default authRouter