import '@testing-library/jest-dom/vitest'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Sidebar from '../../components/Sidebar'

const mockNavigate = vi.fn()
const mockLogoutInstructor = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('../../lib/api', () => ({
  logoutInstructor: () => mockLogoutInstructor(),
}))

describe('Sidebar', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    mockLogoutInstructor.mockReset()
    localStorage.clear()
  })

  it('navigates to student list when clicked', () => {
    render(<Sidebar sidebarOpen={true} closeSidebar={vi.fn()} />)

    fireEvent.click(screen.getAllByRole('button', { name: 'Student List' })[0])

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/students', {
      state: { refreshKey: expect.any(Number) },
    })
  })

  it('logs out and redirects to login', async () => {
    mockLogoutInstructor.mockResolvedValue({})
    localStorage.setItem('authInstructor', JSON.stringify({ id: 1 }))
    localStorage.setItem('assignedStudents', JSON.stringify([]))

    render(<Sidebar sidebarOpen={true} closeSidebar={vi.fn()} />)

    fireEvent.click(screen.getAllByRole('button', { name: 'Logout' })[0])

    await waitFor(() => expect(mockLogoutInstructor).toHaveBeenCalled())
    await waitFor(() => expect(localStorage.getItem('authInstructor')).toBeNull())
    await waitFor(() => expect(localStorage.getItem('assignedStudents')).toBeNull())
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true }))
  })
})