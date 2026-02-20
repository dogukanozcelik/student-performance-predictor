
import { useState } from 'react'
import StudentDetailsModal from '../components/StudentDetailsModal'
import StudentTable from '../components/StudentTable'

const mockStudents = [
  {
    id: 1,
    studentNo: 'STU001',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    g1: 85,
    g2: 90,
    email: 'ahmet.yilmaz@university.edu',
    phone: '+90 512 345 6789',
    department: 'Computer Engineering',
    gpa: 3.8,
    enrollmentYear: 2021,
  },
  {
    id: 2,
    studentNo: 'STU002',
    firstName: 'Ayşe',
    lastName: 'Demir',
    g1: 78,
    g2: 82,
    email: 'ayse.demir@university.edu',
    phone: '+90 512 345 6790',
    department: 'Computer Engineering',
    gpa: 3.6,
    enrollmentYear: 2021,
  },
  {
    id: 3,
    studentNo: 'STU003',
    firstName: 'Mehmet',
    lastName: 'Kaya',
    g1: 92,
    g2: 88,
    email: 'mehmet.kaya@university.edu',
    phone: '+90 512 345 6791',
    department: 'Computer Engineering',
    gpa: 3.9,
    enrollmentYear: 2022,
  },
  {
    id: 4,
    studentNo: 'STU004',
    firstName: 'Fatma',
    lastName: 'Çetin',
    g1: 75,
    g2: 79,
    email: 'fatma.cetin@university.edu',
    phone: '+90 512 345 6792',
    department: 'Computer Engineering',
    gpa: 3.5,
    enrollmentYear: 2022,
  },
]

const StudentList = () => {
  const [students] = useState(mockStudents)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleDetailsClick = (student) => {
    setSelectedStudent(student)
    setShowModal(true)
  }

  const handleReportClick = (studentId) => {
    console.log(`Generating report for student ${studentId}...`)
    // TODO: API call to generate report
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedStudent(null)
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Öğrenci Listesi</h2>
        <p className="text-gray-600 mt-1">Tüm kayıtlı öğrenciler</p>
      </div>

      <StudentTable students={students} onDetailsClick={handleDetailsClick} onReportClick={handleReportClick} />

      {showModal && selectedStudent && <StudentDetailsModal student={selectedStudent} onClose={closeModal} />}
    </div>
  )
}

export default StudentList