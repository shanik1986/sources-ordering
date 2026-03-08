import { useRef } from 'react'
import { useLessonStore } from '../../store/lessonStore'
import { exportLessons, importLessons } from '../../lib/export'

export default function ImportExport() {
  const lessons = useLessonStore((s) => s.lessons)
  const setLessons = useLessonStore((s) => s.setLessons)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    if (lessons.length === 0) {
      alert('אין שיעורים לייצוא')
      return
    }
    exportLessons(lessons)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const imported = await importLessons(file)
      setLessons([...lessons, ...imported])
      alert(`יובאו ${imported.length} שיעורים בהצלחה`)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'שגיאה בייבוא')
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex gap-3 items-center justify-center py-6 border-t border-gray-200 mt-4">
      <button
        onClick={handleExport}
        className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
      >
        ייצוא כל השיעורים
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
      >
        ייבוא שיעורים
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
    </div>
  )
}
