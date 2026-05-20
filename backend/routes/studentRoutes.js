import express from 'express'
import { getStudents, getStudentById, assignStudentToInstructor } from '../controllers/studentController.js'

const router = express.Router()

router.get('/', getStudents)

router.get('/:studentId', getStudentById)

router.patch('/:studentId/courses', assignStudentToInstructor)

export default router
