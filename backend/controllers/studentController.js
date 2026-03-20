import sql from '../config/db.js'

export const getStudents = async (req, res) => {
  try {
    const { instructorId } = req.query

    const students = instructorId
      ? await sql`
          SELECT
            s.id,
            s.student_no,
            s.first_name,
            s.last_name,
            s.email,
            s.phone,
            s.department,
            s.g1,
            s.g2,
            s.gpa,
            s.enrollment_year,
            s.instructor_id,
            i.full_name AS instructor_name,
            i.email AS instructor_email
          FROM students s
          LEFT JOIN instructors i ON i.id = s.instructor_id
          WHERE s.instructor_id = ${instructorId}
          ORDER BY s.student_no ASC
        `
      : await sql`
          SELECT
            s.id,
            s.student_no,
            s.first_name,
            s.last_name,
            s.email,
            s.phone,
            s.department,
            s.g1,
            s.g2,
            s.gpa,
            s.enrollment_year,
            s.instructor_id,
            i.full_name AS instructor_name,
            i.email AS instructor_email
          FROM students s
          LEFT JOIN instructors i ON i.id = s.instructor_id
          ORDER BY s.student_no ASC
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
}

export const getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params

    const students = await sql`
      SELECT
        s.id,
        s.student_no,
        s.first_name,
        s.last_name,
        s.email,
        s.phone,
        s.department,
        s.g1,
        s.g2,
        s.gpa,
        s.enrollment_year,
        s.instructor_id,
        i.full_name AS instructor_name,
        i.email AS instructor_email
      FROM students s
      LEFT JOIN instructors i ON i.id = s.instructor_id
      WHERE s.id = ${studentId}
      LIMIT 1
    `

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student bulunamadı.',
      })
    }

    return res.status(200).json({
      success: true,
      data: students[0],
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const assignStudentToInstructor = async (req, res) => {
  try {
    const { studentId } = req.params
    const { instructorId } = req.body

    if (!instructorId) {
      return res.status(400).json({
        success: false,
        message: 'instructorId zorunludur.',
      })
    }

    const instructorResult = await sql`
      SELECT id
      FROM instructors
      WHERE id = ${instructorId}
        AND role = 'instructor'
      LIMIT 1
    `

    if (instructorResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Instructor bulunamadı.',
      })
    }

    const studentResult = await sql`
      UPDATE students
      SET instructor_id = ${instructorId}, updated_at = NOW()
      WHERE id = ${studentId}
      RETURNING id, student_no, first_name, last_name, instructor_id
    `

    if (studentResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student bulunamadı.',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Student instructor ile eşleştirildi.',
      data: studentResult[0],
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}