import sql from '../config/db.js'
import { GoogleGenAI } from '@google/genai'
import PDFDocument from 'pdfkit'
import { fetchModelPredictionForStudent } from './modelController.js'

const geminiApiKey = process.env.GEMINI_API_KEY
const genAI = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null

const stripMarkdown = (value = '') => value.replace(/\*\*/g, '').replace(/\*/g, '').trim()

const wrapLines = (text = '') =>
  String(text)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

const toScoreRange = (value, step = 10, maxScore = 100) => {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) {
    return 'Unknown range'
  }

  const safeValue = Math.max(0, Math.min(maxScore, numericValue))
  const lowerBound = Math.floor(safeValue / step) * step
  const upperBound = Math.min(maxScore, lowerBound + step)
  return `${lowerBound} ile ${upperBound} arasında`
}

const renderReportToPdf = (doc, student, reportText) => {
  const lines = wrapLines(reportText)

  doc.fontSize(20).text('Student Report', { align: 'center' })
  doc.moveDown(1)

  doc.fontSize(12)
  doc.text(`Name: ${student.first_name} ${student.last_name}`)
  doc.text(`School: ${student.school || ''}`)
  doc.text(`Sex: ${student.sex || ''}`)
  doc.text(`Age: ${student.age || ''}`)
  doc.text(`Courses: ${student.course_names || ''}`)
  doc.text(`Instructors: ${student.instructor_names || ''}`)
  doc.moveDown(1)

  if (lines.length === 0) {
    doc.fontSize(11).text(stripMarkdown(reportText))
    return
  }

  lines.forEach((line) => {
    const cleanedLine = stripMarkdown(line)

    if (!cleanedLine) {
      doc.moveDown(0.5)
      return
    }

    const bulletMatch = cleanedLine.match(/^[*-]\s+(.*)$/)
    if (bulletMatch) {
      doc.fontSize(11).text(`• ${bulletMatch[1]}`, { indent: 14, continued: false })
      return
    }

    const colonIndex = cleanedLine.indexOf(':')
    if (colonIndex > 0 && colonIndex < 60 && !cleanedLine.endsWith(':')) {
      const label = cleanedLine.slice(0, colonIndex + 1)
      const value = cleanedLine.slice(colonIndex + 1).trim()
      doc.fontSize(11)
      doc.text(label, { continued: true })
      doc.font('Helvetica').text(` ${value}`)
      return
    }

    if (cleanedLine.endsWith(':')) {
      doc.moveDown(0.25)
      doc.font('Helvetica-Bold').fontSize(13).text(cleanedLine)
      doc.font('Helvetica').moveDown(0.25)
      return
    }

    doc.font('Helvetica').fontSize(11).text(cleanedLine, { align: 'left' })
  })
}

export const generateReport = async (req, res) => {
  try {
    const { studentId } = req.body

    if (!studentId) {
      return res.status(400).json({ success: false, message: 'studentId zorunludur.' })
    }

    const rows = await sql`
      SELECT
        s.*,
        COALESCE(course_info.course_names, '') AS course_names,
        COALESCE(course_info.instructor_names, '') AS instructor_names
      FROM students s
      LEFT JOIN LATERAL (
        SELECT
          string_agg(DISTINCT c.course_name, ', ') AS course_names,
          string_agg(DISTINCT (i.first_name || ' ' || i.last_name), ', ') AS instructor_names
        FROM students_courses sc
        INNER JOIN courses c ON c.course_id = sc.course_id
        INNER JOIN instructors i ON i.instructor_id = c.instructor_id
        WHERE sc.student_id = s.student_id
      ) course_info ON TRUE
      WHERE s.student_id = ${studentId}
      LIMIT 1
    `

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student bulunamadı.' })
    }

    const student = rows[0]

    const { prediction: modelPrediction } = await fetchModelPredictionForStudent(studentId)
    const predictedG3Range = toScoreRange(modelPrediction?.predicted_G3)
    const modelPredictionForPrompt = {
      ...modelPrediction,
      predicted_G3_range: predictedG3Range,
    }
    delete modelPredictionForPrompt.predicted_G3

    if (!genAI) {
      return res.status(500).json({
        success: false,
        message: 'GEMINI_API_KEY tanımlı değil.',
      })
    }

    const prompt = `You are an academic advisor. Create a professional report for a student. Include: student full name, school, sex, age, family status, parental education, parents' jobs, reason for choosing school, guardian, travel time, study time, failures, support flags, family relation, free time, going out, weekday and weekend alcohol, health, absences, grades (g1, g2), model prediction summary, brief analysis, suggestions, and recommended next steps. Use formal tone. Do not use markdown, bullets, asterisks, or numbered lists. Write simple plain text with section titles ending in a colon. IMPORTANT: Never provide the predicted G3 as an exact numeric value. Always express it as a range sentence such as "They are expected to score between 40 and 50.".

Student data:
${JSON.stringify(student, null, 2)}

Model prediction data:
${JSON.stringify(modelPredictionForPrompt, null, 2)}`

    const result = await genAI.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: prompt,
    })
    const reportText = result.text || 'No report generated.'

    const doc = new PDFDocument({ size: 'A4', margin: 50 })
    const chunks = []
    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks)
      const filename = `${student.first_name || 'student'}_${student.last_name || ''}`.replace(/\s+/g, '_') + '.pdf'
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
      res.send(pdfBuffer)
    })

    renderReportToPdf(doc, student, reportText)

    doc.end()
  } catch (error) {
    console.error('Generate report error', error)
    return res.status(500).json({ success: false, message: error.message })
  }
}

export default { generateReport }
