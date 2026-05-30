import '@testing-library/jest-dom/vitest'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor, cleanup } from '@testing-library/react'

import StudentList from '../../pages/StudentList'

vi.mock('../../components/StudentDetailsModal', () => ({
  default: () => <div>Student Details Modal</div>,
}))

vi.mock('../../components/StudentTable', () => ({
  default: ({ students, onDetailsClick }) => (
    <div>
      <div>Student Table</div>
      <div>{students.map((student) => student.firstName).join(', ')}</div>
      <button type="button" onClick={() => onDetailsClick(students[0])}>
        Open first student
      </button>
    </div>
  ),
}))

const mockGet = vi.fn()
const mockPost = vi.fn()

vi.mock('../../lib/api', () => ({
  apiClient: {
    get: (...args) => mockGet(...args),
    post: (...args) => mockPost(...args),
  },
  normalizeStudent: (value) => ({
    id: value.id ?? value.student_id,
    firstName: value.first_name,
    lastName: value.last_name,
    school: value.school,
  }),
}))

describe('StudentList', () => {
  beforeEach(() => {
    cleanup()
    mockGet.mockReset()
    mockPost.mockReset()
    localStorage.clear()

    URL.createObjectURL = vi.fn(() => 'blob:mock')
    URL.revokeObjectURL = vi.fn()
  })

  it('uses cached students when present', async () => {
    localStorage.setItem(
      'assignedStudents',
      JSON.stringify([
        { id: 1, firstName: 'Ada', lastName: 'Lovelace', school: 'GP' },
      ])
    )

    render(<StudentList />)

    expect(await screen.findByText('Student Table')).toBeInTheDocument()
    expect(mockGet).not.toHaveBeenCalled()
  })

  it('filters students by search term', async () => {
    localStorage.setItem(
      'assignedStudents',
      JSON.stringify([
        { id: 1, firstName: 'Ada', lastName: 'Lovelace', school: 'GP' },
        { id: 2, firstName: 'Grace', lastName: 'Hopper', school: 'CS' },
      ])
    )

    render(<StudentList />)

    await screen.findAllByText('Student Table')

    fireEvent.change(
      screen.getByPlaceholderText('Example: 1, Ahmet, Yılmaz, GP'),
      {
        target: { value: 'Grace' },
      }
    )

    await waitFor(() =>
      expect(screen.getByText('Grace')).toBeInTheDocument()
    )
  })
})