import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useState } from 'react'

import StudentList from './pages/StudentList'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className='min-h-screen bg-[#e5e7eb]'>
      <div className='flex min-h-screen'>
        <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
        <main className='flex-1'>
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className='p-3'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<DashboardLayout />}>
          <Route index element={<StudentList />} />
          <Route path='students' element={<StudentList />} />
        </Route>
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
