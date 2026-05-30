import '@testing-library/jest-dom/vitest'
import { describe, expect, it, beforeEach, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { fireEvent, render, screen, waitFor, cleanup } from '@testing-library/react'

import Login from '../../pages/Login'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('../../lib/api', () => ({
  apiClient: {
    post: vi.fn(),
  },
  normalizeInstructor: vi.fn((value) => ({
    fullName: value.full_name || 'Ada Lovelace',
  })),
  normalizeStudent: vi.fn((value) => value),
}))

import { apiClient } from '../../lib/api'

describe('Login', () => {
  beforeEach(() => {
    cleanup()
    mockNavigate.mockClear()
    apiClient.post.mockReset()
    localStorage.clear()
  })

it('shows validation error when fields are empty', async () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )

  fireEvent.click(screen.getAllByRole('button', { name: /log in/i })[0])

  expect(
    await screen.findByText('Username and password fields are required.')
  ).toBeInTheDocument()
})

  it('logs in and navigates on success', async () => {
    apiClient.post.mockResolvedValue({
      data: {
        data: {
          instructor: { full_name: 'Ada Lovelace' },
          students: [],
        },
      },
    })

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'ada' },
    })

    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'secret' },
    })

    const loginButton = screen.getAllByRole('button', { name: /log in/i })[0]

    fireEvent.click(loginButton)

    await waitFor(() =>
      expect(apiClient.post).toHaveBeenCalledWith('/api/auth/login', {
        username: 'ada',
        password: 'secret',
      })
    )

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    )
  })
})