import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Home from './pages/Home'
import StudentList from './pages/StudentList'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <BrowserRouter>
      <div className='min-h-screen flex flex-col bg-[#e5e7eb]'>
        
        <div className='flex flex-1'>
          <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
          <main className='flex-1'>
            <div>
              <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            </div>
            <div className='p-3'>
              <Routes>
                <Route index element={<Home />} />
                <Route path="/students" element={<StudentList />} />
            </Routes>
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
