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
      SELECT DISTINCT ON (s.student_id)
        s.student_id AS id,
        s.first_name,
        s.last_name,
        s.school,
        s.sex,
        s.age,
        s.address,
        s.famsize,
        s.pstatus,
        s.medu,
        s.fedu,
        s.mjob,
        s.fjob,
        s.reason,
        s.guardian,
        s.traveltime,
        s.studytime,
        s.failures,
        s.schoolsup,
        s.famsup,
        s.paid,
        s.activities,
        s.nursery,
        s.higher,
        s.internet,
        s.romantic,
        s.famrel,
        s.freetime,
        s.goout,
        s.dalc,
        s.walc,
        s.health,
        s.absences,
        s.g1,
        s.g2
      FROM students s
      INNER JOIN students_courses sc ON sc.student_id = s.student_id
      INNER JOIN courses c ON c.course_id = sc.course_id
      WHERE c.instructor_id = ${instructorId}
      ORDER BY s.student_id ASC
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