import { useParams, Link } from 'react-router-dom'
import { useLessonStore } from '../../store/lessonStore'
import PrintableSheet from './PrintableSheet'
import { generatePdf } from '../../lib/pdf'
import { useRef } from 'react'
import type { StyleVariant } from '../../types'

export default function PrintPreview() {
  const { id } = useParams<{ id: string }>()
  const lesson = useLessonStore((s) => s.lessons.find((l) => l.id === id))
  const updateLesson = useLessonStore((s) => s.updateLesson)
  const printRef = useRef<HTMLDivElement>(null)

  if (!lesson) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <p className="text-gray-500 text-xl">השיעור לא נמצא</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">חזרה לרשימת השיעורים</Link>
      </div>
    )
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPdf = async () => {
    if (printRef.current) {
      await generatePdf(printRef.current, lesson.title || 'source-sheet')
    }
  }

  const styleOptions: { value: StyleVariant; label: string }[] = [
    { value: 'classic', label: 'קלאסי' },
    { value: 'modern', label: 'מודרני' },
    { value: 'traditional', label: 'מסורתי' },
    { value: 'minimal', label: 'מינימלי' },
  ]

  return (
    <div>
      {/* Controls - hidden when printing */}
      <div className="no-print bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <Link
            to={`/edit/${lesson.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← חזרה לעריכה
          </Link>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">סגנון:</label>
            <select
              value={lesson.styleVariant}
              onChange={(e) => updateLesson(lesson.id, { styleVariant: e.target.value as StyleVariant })}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              {styleOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            הדפס / שמור כ-PDF
          </button>
          <button
            onClick={handleDownloadPdf}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            הורד PDF
          </button>
        </div>
      </div>

      {/* Printable content */}
      <div className="max-w-4xl mx-auto p-4 md:p-8" ref={printRef}>
        <PrintableSheet lesson={lesson} />
      </div>
    </div>
  )
}
