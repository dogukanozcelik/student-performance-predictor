import express from 'express'
import {
  getInstructorProfile,
} from '../controllers/authController.js'
import sql from '../config/db.js'

const instructorRouter = express.Router()

instructorRouter.get('/:instructorId', getInstructorProfile)

instructorRouter.get('/:instructorId/students', async (req, res) => {
  try {
    const { instructorId } = req.params

    const students = await sql`
      SELECT id, student_no, first_name, last_name, email, phone, department, g1, g2, gpa, enrollment_year
      FROM students
      WHERE instructor_id = ${instructorId}
      ORDER BY student_no ASC
    `

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

export default instructorRouter