
const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
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
        <h1 className="text-right text-lg md:text-2xl">Student Information System</h1>
      </div>
    </header>
  )
}

export default Navbar