import sql from '../config/db.js'

const mapInstructor = (row, studentCount = 0) => ({
  id: row.id,
  user_id: row.user_id,
  username: row.username,
  first_name: row.first_name,
  last_name: row.last_name,
  full_name: `${row.first_name || ''} ${row.last_name || ''}`.trim(),
  email: row.email,
  student_count: studentCount,
})

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
      SELECT
        u.user_id,
        u.username,
        i.instructor_id AS id,
        i.first_name,
        i.last_name,
        i.email
      FROM users u
      INNER JOIN instructors i ON i.user_id = u.user_id
      WHERE u.username = ${username}
        AND u.password = ${password}
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
      SELECT COUNT(DISTINCT s.student_id)::int AS student_count
      FROM students s
      INNER JOIN students_courses sc ON sc.student_id = s.student_id
      INNER JOIN courses c ON c.course_id = sc.course_id
      WHERE c.instructor_id = ${instructor.id}
    `

    const assignedStudents = await sql`
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
      WHERE c.instructor_id = ${instructor.id}
      ORDER BY s.student_id ASC
    `

    return res.status(200).json({
      success: true,
      data: {
        instructor: mapInstructor(instructor, studentCountResult[0]?.student_count ?? 0),
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
      SELECT
        i.instructor_id AS id,
        i.user_id,
        u.username,
        i.first_name,
        i.last_name,
        i.email
      FROM instructors i
      INNER JOIN users u ON u.user_id = i.user_id
      WHERE i.instructor_id = ${instructorId}
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
      SELECT COUNT(DISTINCT s.student_id)::int AS student_count
      FROM students s
      INNER JOIN students_courses sc ON sc.student_id = s.student_id
      INNER JOIN courses c ON c.course_id = sc.course_id
      WHERE c.instructor_id = ${instructor.id}
    `

    return res.status(200).json({
      success: true,
      data: mapInstructor(instructor, studentCount?.student_count ?? 0),
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}