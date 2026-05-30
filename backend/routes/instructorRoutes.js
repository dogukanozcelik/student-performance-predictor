import express from 'express'
import { getInstructorProfile} from '../controllers/authController.js'
import { intructorStudents } from '../controllers/instructorController.js'
import sql from '../config/db.js'

const instructorRouter = express.Router()

instructorRouter.get('/:instructorId', getInstructorProfile)

instructorRouter.get('/:instructorId/students', intructorStudents )

export default instructorRouter