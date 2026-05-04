import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const normalizeStudent = (student) => ({
  id: student.id ?? student.student_id,
  firstName: student.first_name,
  lastName: student.last_name,
  school: student.school,
  sex: student.sex,
  age: student.age,
  address: student.address,
  famsize: student.famsize,
  pstatus: student.pstatus,
  medu: student.medu,
  fedu: student.fedu,
  mjob: student.mjob,
  fjob: student.fjob,
  reason: student.reason,
  guardian: student.guardian,
  traveltime: student.traveltime,
  studytime: student.studytime,
  failures: student.failures,
  schoolsup: student.schoolsup,
  famsup: student.famsup,
  paid: student.paid,
  activities: student.activities,
  nursery: student.nursery,
  higher: student.higher,
  internet: student.internet,
  romantic: student.romantic,
  famrel: student.famrel,
  freetime: student.freetime,
  goout: student.goout,
  dalc: student.dalc,
  walc: student.walc,
  health: student.health,
  absences: student.absences,
  g1: student.g1,
  g2: student.g2,
})

export const normalizeInstructor = (instructor) => ({
  id: instructor.id ?? instructor.instructor_id,
  userId: instructor.user_id,
  firstName: instructor.first_name,
  lastName: instructor.last_name,
  fullName:
    instructor.full_name ||
    `${instructor.first_name || ''} ${instructor.last_name || ''}`.trim(),
  email: instructor.email,
  username: instructor.username,
  studentCount: instructor.student_count ?? 0,
})