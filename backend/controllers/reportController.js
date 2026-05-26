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
            student_id,
    first_name,
    last_name,
    school,
    sex,
    age,
    address,
    famsize,
    Pstatus,
    Medu,
    Fedu,
    Mjob,
    Fjob,
    reason,
    guardian,
    traveltime,
    studytime,
    failures,
    schoolsup,
    famsup,
    paid,
    activities,
    nursery,
    higher,
    internet,
    romantic,
    famrel,
    freetime,
    goout,
    Dalc,
    Walc,
    health,
    absences,
    G1*5,
    G2*5,
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
        message: 'GEMINI_API_KEY not defined.',
      })
    }

    const prompt = `You are an academic advisor working with an AI-based student performance prediction system.

Generate a short, professional, and insight-focused student evaluation report.

The report should interpret the student data instead of listing every variable individually.

Keep the report concise and readable.
Avoid long explanations and unnecessary detail.

Use clear section titles so the reader can easily distinguish each part of the report.

Required section titles:
Overview:
Academic Evaluation:
Behavioral & Social Factors:
Prediction Summary:
Recommendations:
Final Assessment:

Instructions:
•⁠  ⁠Do not use markdown, bullet points, or numbered lists.
•⁠  ⁠Keep each section short and focused.
•⁠  ⁠Use natural professional language.
•⁠  ⁠Avoid robotic or repetitive phrasing.
•⁠  ⁠Do not repeat raw input values unnecessarily.
•⁠  ⁠Focus on interpreting the meaning of the data.
•⁠  ⁠Mention both strengths and possible risks.
•⁠  ⁠Treat the AI prediction as a supportive estimation, not an absolute fact.
•⁠  ⁠Never provide predicted G3 as an exact number.
•⁠  ⁠Always express predicted performance as a score range.

Examples:
"The student is expected to perform within the 70–75 range."
"The prediction suggests a moderate academic outcome."

When mentioning confidence or probabilities, explain them briefly in plain language instead of directly printing JSON values.

The tone should resemble a real advisor report written for teachers or school administrators.


Student data:
${JSON.stringify(student, null, 2)}

Model prediction data:
${JSON.stringify(modelPredictionForPrompt, null, 2)}`

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

    const generateContentWithRetry = async ({ model, contents }, retries = 3) => {
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          return await genAI.models.generateContent({ model, contents })
        } catch (error) {
          const status = error.status || error?.error?.code

          const retryableStatuses = [429, 500, 502, 503, 504]

          if (!retryableStatuses.includes(status) || attempt === retries - 1) {
            throw error
          }

          await sleep(1000 * Math.pow(2, attempt))
        }
      }
    }

    const result = await generateContentWithRetry({
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

  const status = error.status || error?.error?.code

  if ([429, 503, 504].includes(status)) {
    return res.status(503).json({
      success: false,
      message: 'AI service is not available.',
    })
  }

  return res.status(500).json({
    success: false,
    message: 'Report generation failed.',
  })
}
}

export default { generateReport }
