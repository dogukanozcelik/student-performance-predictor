
import { useEffect, useState } from 'react'
import StudentDetailsModal from '../components/StudentDetailsModal'
import StudentTable from '../components/StudentTable'
import { apiClient, normalizeStudent } from '../lib/api'

const StudentList = () => {
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const loadStudents = async () => {
      const storedInstructor = localStorage.getItem('authInstructor')
      const storedStudents = localStorage.getItem('assignedStudents')
      const instructor = storedInstructor ? JSON.parse(storedInstructor) : null
      const cachedStudents = storedStudents ? JSON.parse(storedStudents) : null

      if (Array.isArray(cachedStudents) && cachedStudents.length > 0) {
        setStudents(cachedStudents)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setErrorMessage('')

        const endpoint = instructor?.id
          ? `/api/instructors/${instructor.id}/students`
          : '/api/students'

        const response = await apiClient.get(endpoint)
        const normalizedStudents = (response.data.data ?? []).map(normalizeStudent)

        setStudents(normalizedStudents)
        localStorage.setItem('assignedStudents', JSON.stringify(normalizedStudents))
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || 'Öğrenci verileri yüklenemedi.')
      } finally {
        setLoading(false)
      }
    }

    loadStudents()
  }, [])

  const handleDetailsClick = (student) => {
    setSelectedStudent(student)
    setShowModal(true)
  }

  const handleReportClick = async (student) => {
    try {
      setLoading(true)
      // Request PDF from backend; expect binary blob
      const response = await apiClient.post(
        '/api/reports',
        { studentId: student.id },
        { responseType: 'blob' }
      )

      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const safeFirst = (student.firstName || 'student').replace(/\s+/g, '_')
      const safeLast = (student.lastName || '').replace(/\s+/g, '_')
      link.href = url
      link.download = `${safeFirst}_${safeLast}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Report generation failed', error)
      setErrorMessage(error?.response?.data?.message || 'Rapor oluşturulamadı.')
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedStudent(null)
  }

  const filteredStudents = students.filter((student) => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase()

    if (!normalizedSearchTerm) {
      return true
    }

    return [student.id, student.firstName, student.lastName, student.school]
      .some((value) => String(value).toLowerCase().includes(normalizedSearchTerm))
  })

  return (
    <div className="w-full">
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-gray-800">Student List</h2>
      </div>

      {!loading && !errorMessage ? (
          <div className="mb-3 flex justify-end">
            <div className="w-full max-w-md rounded-lg">
          <input
            id="student-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Example: 1, Ahmet, Yılmaz, GP"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:bg-white"
          />
            </div>
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-slate-600">
          Students are loading...
        </div>
      ) : errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-slate-600">
          No students found for the current search.
        </div>
      ) : (
        <StudentTable students={filteredStudents} onDetailsClick={handleDetailsClick} onReportClick={handleReportClick} />
      )}

      {showModal && selectedStudent && <StudentDetailsModal student={selectedStudent} onClose={closeModal} />}
    </div>
  )
}

export default StudentList