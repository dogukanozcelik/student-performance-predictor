import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import StudentList from './pages/StudentList'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

function App() {
  return (
    <BrowserRouter>

      <div className='min-h-screen flex flex-col'>
        <Navbar/>
        <div className='flex flex-1'>
            <Sidebar/>
          <main className='flex-1'>
            <Routes>
              <Route index element={<Home />} />
              <Route path="/students" element={<StudentList />} />
          </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
