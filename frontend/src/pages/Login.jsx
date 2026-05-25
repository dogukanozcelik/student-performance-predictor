import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { normalizeInstructor, normalizeStudent,apiClient } from '../lib/api'

function Login() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')


  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const username = String(formData.get('username') || '').trim()
    const password = String(formData.get('password') || '').trim()

    if (!username || !password) {
      setErrorMessage('Username and password fields are required.')
      return
    }

    try {
      const response = await apiClient.post('/api/auth/login', {
        username,
        password,
      })

      const instructor = normalizeInstructor(response.data.data.instructor || {})
      const students = (response.data.data.students || []).map(normalizeStudent)

      localStorage.setItem('authInstructor', JSON.stringify(instructor))
      localStorage.setItem('assignedStudents', JSON.stringify(students))
      setErrorMessage('')
      navigate('/dashboard')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Could not connect to the server. Check whether the backend is running.')
    }
  }

  return (
    <div className='relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_30%),linear-gradient(135deg,#eaf1f7_0%,#f4f7fb_42%,#e6ebf2_100%)] px-4 py-8 sm:px-6 lg:px-8'>
      <div className='absolute -left-24 top-20 h-52 w-52 rounded-full bg-sky-300/30 blur-3xl' />
      <div className='absolute -right-20 bottom-8 h-64 w-64 rounded-full bg-[#24364a]/15 blur-3xl' />

      <div className='mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center'>
        <div className='grid w-full overflow-hidden rounded-4xl bg-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/70 md:grid-cols-2'>
          <section className='relative hidden min-h-152 overflow-hidden bg-[#24364a] md:block'>
            <div
              className='absolute inset-0'
              style={{
                backgroundImage:
                  'linear-gradient(155deg, rgba(255,255,255,0.08), transparent 42%), radial-gradient(circle at top right, rgba(56,189,248,0.28), transparent 28%), radial-gradient(circle at bottom left, rgba(15,118,110,0.2), transparent 28%)',
              }}
            />
            <div
              className='absolute inset-0 opacity-35'
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)",
                backgroundSize: '28px 28px',
              }}
            />

            <div className='relative flex h-full flex-col justify-between p-10 text-white'>
              <div className='flex items-center gap-4'>
                <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur'>
                  <img src={logo} alt='Okasa Ozzeku University logo' className='h-12 w-12 object-contain' />
                </div>
                <div>
                  <p className='text-sm uppercase tracking-[0.35em] text-white/65'>Student Portal</p>
                  <h1 className='mt-1 text-2xl font-semibold tracking-wide'>OKASA OZZEKU UNIVERSITY</h1>
                </div>
              </div>

              <div className='max-w-md space-y-6'>
                <div className='space-y-3'>
                  <h2 className='text-4xl font-semibold leading-tight'>
                      Predict student performance with <br/>AI-powered insights
                  </h2>
                  <p className='max-w-sm text-base leading-7 text-white/70'>
                    Log in to analyze student data, generate performance predictions and access the intelligent dashboard designed for academic success evaluation.
                  </p>
                </div>

                <div className='grid grid-cols-3 gap-3 pt-4'>
                  <div className='rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur'>
                    <p className='text-xs uppercase tracking-[0.25em] text-white/55'>Students</p>
                    <p className='mt-2 text-2xl font-semibold'>100+</p>
                  </div>
                  <div className='rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur'>
                    <p className='text-xs uppercase tracking-[0.25em] text-white/55'>Courses</p>
                    <p className='mt-2 text-2xl font-semibold'>50+</p>
                  </div>
                  <div className='rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur'>
                    <p className='text-xs uppercase tracking-[0.25em] text-white/55'>Reports</p>
                    <p className='mt-2 text-2xl font-semibold'>40+</p>
                  </div>
                </div>
              </div>

              <div className='flex items-center justify-between text-sm text-white/60'>
                <span>© 2026 Okasa Ozzeku University</span>
                <span>Graduate Project</span>
              </div>
            </div>
          </section>

          <section className='flex items-center justify-center bg-white px-6 py-10 sm:px-10 lg:px-12'>
            <div className='w-full max-w-md'>
              <div className='mb-8 flex flex-col items-center'>
                <img src={logo} alt='Okasa Ozzeku University' className='w-24 object-contain sm:w-28' />
                <h2 className='mt-4 text-center text-xl font-semibold tracking-[0.2em] text-slate-800'>
                  OKASA OZZEKU UNIVERSITY
                </h2>
                <p className='mt-2 text-sm text-slate-500'>Student Information System</p>
              </div>

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label htmlFor='username' className='mb-2 block text-sm font-medium text-slate-600'>
                    Username
                  </label>
                  <input
                    id='username'
                    name='username'
                    type='text'
                    placeholder='username'
                    autoComplete='username'
                    className='w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100'
                  />
                </div>

                <div>
                  <label htmlFor='password' className='mb-2 block text-sm font-medium text-slate-600'>
                    Password
                  </label>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    placeholder='Password'
                    autoComplete='current-password'
                    className='w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100'
                  />
                </div>

                {errorMessage ? (
                  <p className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'>
                    {errorMessage}
                  </p>
                ) : null}

                <button
                  type='submit'
                  className='mt-2 w-full rounded-xl bg-[#24364a] px-4 py-3.5 font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-[#1d2b3a] focus:outline-none focus:ring-4 focus:ring-slate-300'
                >
                  Log in
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Login