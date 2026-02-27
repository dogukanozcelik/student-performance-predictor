const StudentDetailsModal = ({ student, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#24364a] text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b">
          <h3 className="text-lg sm:text-2xl font-bold">Student Details</h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition shrink-0"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Student No</label>
              <p className="text-sm sm:text-base text-gray-900 font-semibold">{student.studentNo}</p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">First Name</label>
              <p className="text-sm sm:text-base text-gray-900 font-semibold">{student.firstName}</p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <p className="text-sm sm:text-base text-gray-900 font-semibold">{student.lastName}</p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-sm sm:text-base text-gray-900 font-semibold break-all">{student.email}</p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Phone</label>
              <p className="text-sm sm:text-base text-gray-900 font-semibold">{student.phone}</p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Department</label>
              <p className="text-sm sm:text-base text-gray-900 font-semibold">{student.department}</p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">G1 Grade</label>
              <p className="text-base sm:text-lg font-semibold text-blue-600">{student.g1}</p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">G2 Grade</label>
              <p className="text-base sm:text-lg font-semibold text-green-600">{student.g2}</p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">GPA</label>
              <p className="text-sm sm:text-base text-gray-900 font-semibold">{student.gpa.toFixed(2)}</p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Enrollment Year</label>
              <p className="text-sm sm:text-base text-gray-900 font-semibold">{student.enrollmentYear}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDetailsModal
