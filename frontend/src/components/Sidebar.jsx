import { useNavigate, Link } from 'react-router-dom'
import { logoutInstructor } from '../lib/api'
import logo from '../assets/logo.png'

const navigationItems = [
  { label: 'Student List', to: '/dashboard/students' },
  { label: 'Logout', action: 'logout' },
]

const Sidebar = ({ sidebarOpen, closeSidebar }) => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logoutInstructor()
    } finally {
      localStorage.removeItem('authInstructor')
      localStorage.removeItem('assignedStudents')
      closeSidebar()
      navigate('/', { replace: true })
    }
  }

  return (
    <>
      <aside className="hidden w-62.5 shrink-0 bg-[#2B3744] text-white md:block">
        <div className="sticky top-0 h-[calc(100vh-5rem)] overflow-y-auto px-3 py-2">
          <SidebarContent closeSidebar={closeSidebar} onLogout={handleLogout} />
        </div>
      </aside>

      <div
        className={`fixed inset-0 z-30 bg-black/35 transition-opacity duration-200 md:hidden ${
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeSidebar}
        aria-hidden={!sidebarOpen}
      />

      <aside
        className={`fixed left-0 top-0 z-40 h-[calc(100vh-5rem)] w-62.5 bg-[#2B3744] px-3 py-4 text-white shadow-xl transition-transform duration-300 md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent closeSidebar={closeSidebar} onLogout={handleLogout} />
      </aside>
    </>
  )
}

const SidebarContent = ({ closeSidebar, onLogout }) => {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center border-b border-white/35 ">
        <img src={logo} alt="Logo" className='w-20'/>
        <div className="leading-tight">
          <p className="text-xl font-semibold">Okasa Ozzeku</p>
          <p className="text-xl font-semibold">University</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1.5">
        {navigationItems.map((item) => (
          item.action === 'logout' ? (
            <button
              key={item.label}
              type="button"
              onClick={onLogout}
              className="rounded-md px-8 py-2.5 text-left text-lg font-medium text-white/95 transition hover:bg-white/10 md:text-[25px]"
            >
              {item.label}
            </button>
          ) : (
            <Link
              key={item.label}
              to={item.to}
              state={{ resetStudentList: Date.now() }}
              onClick={closeSidebar}
              className="rounded-md px-8 py-2.5 text-start text-lg font-medium text-white/95 transition hover:bg-white/10 md:text-[25px]"
            >
              {item.label}
            </Link>
          )
        ))}
      </nav>
    </div>
  )
}

export default Sidebar