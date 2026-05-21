import sql from '../config/db.js'

const MODEL_SERVICE_URL = process.env.MODEL_SERVICE_URL

const toModelPayload = (student) => ({
  student_id: student.student_id,
  first_name: student.first_name,
  last_name: student.last_name,
  school: student.school,
  sex: student.sex,
  age: Number(student.age ?? 0),
  address: student.address,
  famsize: student.famsize,
  Pstatus: student.pstatus,
  Medu: Number(student.medu ?? 0),
  Fedu: Number(student.fedu ?? 0),
  Mjob: student.mjob,
  Fjob: student.fjob,
  reason: student.reason,
  guardian: student.guardian,
  traveltime: Number(student.traveltime ?? 0),
  studytime: Number(student.studytime ?? 0),
  failures: Number(student.failures ?? 0),
  schoolsup: student.schoolsup,
  famsup: student.famsup,
  paid: student.paid,
  activities: student.activities,
  nursery: student.nursery,
  higher: student.higher,
  internet: student.internet,
  romantic: student.romantic,
  famrel: Number(student.famrel ?? 0),
  freetime: Number(student.freetime ?? 0),
  goout: Number(student.goout ?? 0),
  Dalc: Number(student.dalc ?? 0),
  Walc: Number(student.walc ?? 0),
  health: Number(student.health ?? 0),
  absences: Number(student.absences ?? 0),
  G1: Number(student.g1 ?? 0),
  G2: Number(student.g2 ?? 0),
})

export const fetchModelPredictionForStudent = async (studentId) => {
  const rows = await sql`
    SELECT *
    FROM students s
    WHERE s.student_id = ${studentId}
    LIMIT 1
  `

  if (rows.length === 0) {
    const notFoundError = new Error('Student not found.')
    notFoundError.statusCode = 404
    throw notFoundError
  }

  const payload = toModelPayload(rows[0])

  const response = await fetch(`${MODEL_SERVICE_URL}/predict-g3`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    const serviceError = new Error(`Model service error: ${response.status} ${errorText}`)
    serviceError.statusCode = 502
    throw serviceError
  }

  const prediction = await response.json()

  return { payload, prediction }
}

export const predictStudentModel = async (req, res) => {
  try {
    const { studentId } = req.params

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'studentId is required.',
      })
    }

    const result = await fetchModelPredictionForStudent(studentId)

    return res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Model prediction error', error)

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    })
  }
}