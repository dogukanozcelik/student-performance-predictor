import { useEffect, useState } from 'react'

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const [instructorName, setInstructorName] = useState('')

  useEffect(() => {
    const storedInstructor = localStorage.getItem('authInstructor')

    if (!storedInstructor) {
      return
    }

    try {
      const parsedInstructor = JSON.parse(storedInstructor)
      setInstructorName(
        parsedInstructor.fullName ||
          parsedInstructor.full_name ||
          [parsedInstructor.firstName, parsedInstructor.lastName].filter(Boolean).join(' ')
      )
    } catch {
      setInstructorName('')
    }
  }, [])

  return (
    <header className="h-22 bg-[#2B3744] px-4 md:px-8 text-white ">
      <div className="mx-auto flex h-full  items-center justify-between">
        <div className="flex items-center gap-3 md:invisible md:w-10">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="inline-flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-md border border-white/20 bg-white/5 md:hidden"
            aria-label="Toggle sidebar"
          >
            <span className="block h-0.5 w-5 bg-white" />
            <span className="block h-0.5 w-5 bg-white" />
            <span className="block h-0.5 w-5 bg-white" />
            <span className="sr-only">Menu</span>
          </button>
        </div>
        <div className="text-right">
          <h1 className="text-lg md:text-2xl">Student Information System</h1>
          {instructorName ? (
            <p className="text-xs text-white/70 md:text-sm">Welcome, {instructorName}</p>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export default Navbar