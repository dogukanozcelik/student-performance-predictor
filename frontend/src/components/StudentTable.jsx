const StudentTable = ({ students, onDetailsClick, onReportClick }) => {
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="w-full table-fixed">
          <thead className="bg-[#24364a] text-white">
            <tr>
              <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold">Student ID</th>
              <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold">First Name</th>
              <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold">Last Name</th>
              <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold">G1 Grade</th>
              <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold">G2 Grade</th>
              <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold">Absences</th>
              <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 md:px-6 py-4 text-sm text-gray-800 font-medium">{student.id}</td>
                <td className="px-4 md:px-6 py-4 text-sm text-gray-800">{student.firstName}</td>
                <td className="px-4 md:px-6 py-4 text-sm text-gray-800">{student.lastName}</td>
                <td className="px-4 md:px-6 py-4 text-sm text-gray-800">
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {student.g1*5}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-4 text-sm text-gray-800">
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {student.g2*5}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-4 text-sm text-gray-800">{student.absences}</td>
                <td className="px-4 md:px-6 py-4 text-sm flex gap-2">
                  <button
                    onClick={() => onDetailsClick(student)}
                    className=" bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md transition font-medium text-xs"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onReportClick(student)}
                    className=" bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 rounded-md transition font-medium text-xs"
                  >
                    Generate Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {students.map((student) => (
          <div key={student.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="mb-4 pb-4 border-b border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Student ID</p>
              <p className="text-lg font-semibold text-gray-800">{student.id}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Name</p>
                <p className="text-sm font-medium text-gray-800">{student.firstName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Lastname</p>
                <p className="text-sm font-medium text-gray-800">{student.lastName}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">G1 Grade</p>
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                  {student.g1*5}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">G2 Grade</p>
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                  {student.g2*5}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Absences</p>
                <p className="text-sm font-medium text-gray-800">{student.absences}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onDetailsClick(student)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md transition font-medium text-xs"
              >
                Details
              </button>
              <button
                onClick={() => onReportClick(student)}
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 rounded-md transition font-medium text-xs"
              >
                Generate Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default StudentTable
