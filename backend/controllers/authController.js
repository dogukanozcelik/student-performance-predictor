import sql from '../config/db.js'

export const loginInstructor = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'username ve password zorunludur.',
      })
    }

    const instructors = await sql`
      SELECT id, full_name, email, username, role, department, created_at, updated_at
      FROM instructors
      WHERE username = ${username}
        AND password_hash = crypt(${password}, password_hash)
        AND role = 'instructor'
      LIMIT 1
    `

    if (instructors.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz instructor bilgileri.',
      })
    }

    const instructor = instructors[0]

    const studentCountResult = await sql`
      SELECT COUNT(*)::int AS student_count
      FROM students
      WHERE instructor_id = ${instructor.id}
    `

    const assignedStudents = await sql`
      SELECT id, student_no, first_name, last_name, email, phone, department, g1, g2, gpa, enrollment_year
      FROM students
      WHERE instructor_id = ${instructor.id}
      ORDER BY student_no ASC
    `

    return res.status(200).json({
      success: true,
      data: {
        instructor: {
          ...instructor,
          student_count: studentCountResult[0]?.student_count ?? 0,
        },
        students: assignedStudents,
      },
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const getInstructorProfile = async (req, res) => {
  try {
    const { instructorId } = req.params

    const instructors = await sql`
      SELECT id, full_name, email, username, role, department, created_at, updated_at
      FROM instructors
      WHERE id = ${instructorId}
      LIMIT 1
    `

    if (instructors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Instructor bulunamadı.',
      })
    }

    const [instructor] = instructors

    const [studentCount] = await sql`
      SELECT COUNT(*)::int AS student_count
      FROM students
      WHERE instructor_id = ${instructor.id}
    `

    return res.status(200).json({
      success: true,
      data: {
        ...instructor,
        student_count: studentCount?.student_count ?? 0,
      },
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}