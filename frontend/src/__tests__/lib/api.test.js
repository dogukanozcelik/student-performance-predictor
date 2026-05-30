import { describe, expect, it } from 'vitest'

import {
  normalizeInstructor,
  normalizeStudent,
} from '../../lib/api'

describe('normalizeStudent', () => {
  it('maps backend student fields to frontend shape', () => {
    const result = normalizeStudent({
      student_id: 7,
      first_name: 'Kadir',
      last_name: 'Zeybekoğlu',
      school: 'GP',
      age: 17,
      g1: 14,
      g2: 15,
    })

    expect(result).toEqual(
      expect.objectContaining({
        id: 7,
        firstName: 'Kadir',
        lastName: 'Zeybekoğlu',
        school: 'GP',
        age: 17,
        g1: 14,
        g2: 15,
      })
    )
  })
})

describe('normalizeInstructor', () => {
  it('builds a fullName and keeps backend ids', () => {
    const result = normalizeInstructor({
      instructor_id: 5,
      user_id: 12,
      first_name: 'Doğukan',
      last_name: 'Özçelik',
      email: 'dogukan@example.com',
    })

    expect(result).toEqual(
      expect.objectContaining({
        id: 5,
        userId: 12,
        firstName: 'Doğukan',
        lastName: 'Özçelik',
        fullName: 'Doğukan Özçelik',
        email: 'dogukan@example.com',
      })
    )
  })
})