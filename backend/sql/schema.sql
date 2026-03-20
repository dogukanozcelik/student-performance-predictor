CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS instructors (
  id BIGSERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'instructor' CHECK (role = 'instructor'),
  department TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
  id BIGSERIAL PRIMARY KEY,
  student_no TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  department TEXT,
  g1 INTEGER NOT NULL DEFAULT 0 CHECK (g1 BETWEEN 0 AND 100),
  g2 INTEGER NOT NULL DEFAULT 0 CHECK (g2 BETWEEN 0 AND 100),
  gpa NUMERIC(3, 2) NOT NULL DEFAULT 0,
  enrollment_year INTEGER,
  instructor_id BIGINT REFERENCES instructors(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_students_instructor_id ON students (instructor_id);

INSERT INTO instructors (full_name, email, username, password_hash, department)
VALUES
  ('Dr. Ayse Kaya', 'ayse.kaya@university.edu', 'instructor1', crypt('123456', gen_salt('bf')), 'Computer Engineering'),
  ('Dr. Mehmet Demir', 'mehmet.demir@university.edu', 'instructor2', crypt('123456', gen_salt('bf')), 'Computer Engineering')
ON CONFLICT (username) DO NOTHING;

INSERT INTO students (student_no, first_name, last_name, email, phone, department, g1, g2, gpa, enrollment_year, instructor_id)
SELECT 'STU001', 'Ahmet', 'Yilmaz', 'ahmet.yilmaz@university.edu', '+90 512 345 6789', 'Computer Engineering', 85, 90, 3.80, 2021, i.id
FROM instructors i
WHERE i.username = 'instructor1'
ON CONFLICT (student_no) DO NOTHING;

INSERT INTO students (student_no, first_name, last_name, email, phone, department, g1, g2, gpa, enrollment_year, instructor_id)
SELECT 'STU002', 'Ayse', 'Demir', 'ayse.demir@university.edu', '+90 512 345 6790', 'Computer Engineering', 78, 82, 3.60, 2021, i.id
FROM instructors i
WHERE i.username = 'instructor1'
ON CONFLICT (student_no) DO NOTHING;

INSERT INTO students (student_no, first_name, last_name, email, phone, department, g1, g2, gpa, enrollment_year, instructor_id)
SELECT 'STU003', 'Mehmet', 'Kaya', 'mehmet.kaya@university.edu', '+90 512 345 6791', 'Computer Engineering', 92, 88, 3.90, 2022, i.id
FROM instructors i
WHERE i.username = 'instructor1'
ON CONFLICT (student_no) DO NOTHING;

INSERT INTO students (student_no, first_name, last_name, email, phone, department, g1, g2, gpa, enrollment_year, instructor_id)
SELECT 'STU004', 'Fatma', 'Cetin', 'fatma.cetin@university.edu', '+90 512 345 6792', 'Computer Engineering', 75, 79, 3.50, 2022, i.id
FROM instructors i
WHERE i.username = 'instructor1'
ON CONFLICT (student_no) DO NOTHING;

INSERT INTO students (student_no, first_name, last_name, email, phone, department, g1, g2, gpa, enrollment_year, instructor_id)
SELECT 'STU005', 'Ali', 'Yildiz', 'ali.yildiz@university.edu', '+90 512 345 6793', 'Computer Engineering', 88, 92, 3.80, 2022, i.id
FROM instructors i
WHERE i.username = 'instructor2'
ON CONFLICT (student_no) DO NOTHING;

INSERT INTO students (student_no, first_name, last_name, email, phone, department, g1, g2, gpa, enrollment_year, instructor_id)
SELECT 'STU006', 'Elif', 'Ozturk', 'elif.ozturk@university.edu', '+90 512 345 6794', 'Computer Engineering', 80, 85, 3.70, 2022, i.id
FROM instructors i
WHERE i.username = 'instructor2'
ON CONFLICT (student_no) DO NOTHING;

INSERT INTO students (student_no, first_name, last_name, email, phone, department, g1, g2, gpa, enrollment_year, instructor_id)
SELECT 'STU007', 'Deniz', 'Arslan', 'deniz.arslan@university.edu', '+90 512 345 6795', 'Computer Engineering', 82, 87, 3.80, 2022, i.id
FROM instructors i
WHERE i.username = 'instructor2'
ON CONFLICT (student_no) DO NOTHING;

INSERT INTO students (student_no, first_name, last_name, email, phone, department, g1, g2, gpa, enrollment_year, instructor_id)
SELECT 'STU008', 'Seda', 'Kara', 'seda.kara@university.edu', '+90 512 345 6796', 'Computer Engineering', 90, 95, 3.90, 2022, i.id
FROM instructors i
WHERE i.username = 'instructor2'
ON CONFLICT (student_no) DO NOTHING;