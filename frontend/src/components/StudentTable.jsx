const StudentTable = ({ students, onDetailsClick, onReportClick }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md bg-white">
      <table className="w-full">
        <thead className="bg-[#24364a] text-white">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold">Öğrenci No</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Adı</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Soyadı</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">G1 Notu</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">G2 Notu</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">İşlemler</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-800 font-medium">{student.studentNo}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{student.firstName}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{student.lastName}</td>
              <td className="px-6 py-4 text-sm text-gray-800">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                  {student.g1}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-800">
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                  {student.g2}
                </span>
              </td>
              <td className="px-6 py-4 text-sm space-x-2 flex flex-wrap gap-2">
                <button
                  onClick={() => onDetailsClick(student)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition font-medium text-xs"
                >
                  Detaylar
                </button>
                <button
                  onClick={() => onReportClick(student.id)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition font-medium text-xs cursor-not-allowed opacity-60"
                  disabled
                >
                  Rapor Oluştur
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StudentTable
