const StudentDetailsModal = ({ student, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#24364a] text-white px-6 py-4 flex items-center justify-between border-b">
          <h3 className="text-2xl font-bold">Öğrenci Detayları</h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Öğrenci No</label>
              <p className="text-gray-900 font-semibold">{student.studentNo}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adı</label>
              <p className="text-gray-900 font-semibold">{student.firstName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Soyadı</label>
              <p className="text-gray-900 font-semibold">{student.lastName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
              <p className="text-gray-900 font-semibold">{student.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <p className="text-gray-900 font-semibold">{student.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bölüm</label>
              <p className="text-gray-900 font-semibold">{student.department}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">G1 Notu</label>
              <p className="text-gray-900 font-semibold text-lg text-blue-600">{student.g1}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">G2 Notu</label>
              <p className="text-gray-900 font-semibold text-lg text-green-600">{student.g2}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
              <p className="text-gray-900 font-semibold">{student.gpa.toFixed(2)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kayıt Yılı</label>
              <p className="text-gray-900 font-semibold">{student.enrollmentYear}</p>
            </div>
          </div>

          <div className="border-t pt-4 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition font-medium"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDetailsModal
