import express from 'express'
import { loginInstructor } from '../controllers/authController.js'

const authRouter = express.Router()

authRouter.post('/login', loginInstructor)

export default authRouter