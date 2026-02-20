import { Link } from 'react-router-dom'

const navigationItems = [
  { label: 'Home Page', to: '/' },
  { label: 'Student List', to: '/students' },

]

const Sidebar = ({ sidebarOpen, closeSidebar }) => {
  return (
    <>
      <aside className="hidden w-[250px] shrink-0 bg-[#2B3744] text-white md:block">
        <div className="sticky top-0 h-[calc(100vh-5rem)] overflow-y-auto px-3 py-2">
          <SidebarContent closeSidebar={closeSidebar} />
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
        className={`fixed left-0 top-20 z-40 h-[calc(100vh-5rem)] w-[250px] bg-[#2B3744] px-3 py-4 text-white shadow-xl transition-transform duration-300 md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent closeSidebar={closeSidebar} />
      </aside>
    </>
  )
}

const SidebarContent = ({ closeSidebar }) => {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center border-b border-white/35 ">
        <img src="src/assets/logo.png" alt="Logo" className='w-20'/>
        <div className="leading-tight">
          <p className="text-xl font-semibold">Okasa Ozzeku</p>
          <p className="text-xl font-semibold">University</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1.5">
        {navigationItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            onClick={closeSidebar}
            className="rounded-md px-4 py-2.5 text-2xl font-medium text-white/95 transition hover:bg-white/10 md:text-[30px]"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar