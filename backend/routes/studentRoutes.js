import express from 'express'
import {
  assignStudentToInstructor,
  getStudentById,
  getStudents,
} from '../controllers/studentController.js'

const studentRouter = express.Router()

studentRouter.get('/', getStudents)
studentRouter.get('/:studentId', getStudentById)
studentRouter.patch('/:studentId/instructor', assignStudentToInstructor)

export default studentRouter