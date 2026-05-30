import '@testing-library/jest-dom/vitest'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import StudentTable from '../components/StudentTable'

const students = [
  {
    id: 1,
    firstName: 'Kadir',
    lastName: 'Zeybekoğlu',
    g1: 14,
    g2: 15,
    absences: 2,
  },
]

describe('StudentTable', () => {
  it('renders student data and triggers actions in desktop view', () => {
    const onDetailsClick = vi.fn()
    const onReportClick = vi.fn()

    render(
      <StudentTable
        students={students}
        onDetailsClick={onDetailsClick}
        onReportClick={onReportClick}
      />
    )

    expect(screen.getByText('1', { selector: 'td' })).toBeInTheDocument()
    expect(screen.getByText('Kadir', { selector: 'td' })).toBeInTheDocument()
    expect(screen.getByText('Zeybekoğlu', { selector: 'td' })).toBeInTheDocument()
    expect(screen.getAllByText('70')[0]).toBeInTheDocument()
    expect(screen.getAllByText('75')[0]).toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button', { name: 'Details' })[0])
    fireEvent.click(screen.getAllByRole('button', { name: 'Generate Report' })[0])

    expect(onDetailsClick).toHaveBeenCalledWith(students[0])
    expect(onReportClick).toHaveBeenCalledWith(students[0])
  })
})