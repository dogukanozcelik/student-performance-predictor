import sql from '../config/db.js'

const buildStudentSelect = (withInstructorFilter = false) => `
  SELECT ${withInstructorFilter ? 'DISTINCT ON (s.student_id)' : ''}
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
`

export const getStudents = async (req, res) => {
  try {
    const { instructorId } = req.query

    const students = instructorId
      ? await sql`
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
      : await sql`
          SELECT
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
}

export const getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params

    const students = await sql`
      SELECT
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
      WHERE s.student_id = ${studentId}
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
    const { courseId } = req.body

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'courseId zorunludur.',
      })
    }

    const studentResultCheck = await sql`
      SELECT student_id
      FROM students
      WHERE student_id = ${studentId}
      LIMIT 1
    `

    if (studentResultCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student bulunamadı.',
      })
    }

    const courseResult = await sql`
      SELECT course_id
      FROM courses
      WHERE course_id = ${courseId}
      LIMIT 1
    `

    if (courseResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course bulunamadı.',
      })
    }

    await sql`
      INSERT INTO students_courses (course_id, student_id)
      VALUES (${courseId}, ${studentId})
      ON CONFLICT (course_id, student_id) DO NOTHING
    `

    return res.status(200).json({
      success: true,
      message: 'Student course ile eşleştirildi.',
      data: {
        student_id: Number(studentId),
        course_id: Number(courseId),
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