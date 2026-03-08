import { useParams, Link } from 'react-router-dom'
import { useLessonStore } from '../../store/lessonStore'
import LessonMetadata from './LessonMetadata'
import SourceBlockEditor from './SourceBlockEditor'

export default function LessonEditor() {
  const { id } = useParams<{ id: string }>()
  const lesson = useLessonStore((s) => s.lessons.find((l) => l.id === id))
  const addBlock = useLessonStore((s) => s.addBlock)

  if (!id || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="text-center space-y-4">
          <p className="text-gray-500 text-lg">השיעור לא נמצא</p>
          <Link
            to="/"
            className="inline-block text-blue-600 hover:text-blue-700 font-medium"
          >
            &larr; חזרה לרשימת השיעורים
          </Link>
        </div>
      </div>
    )
  }

  const blocks = lesson.sourceBlocks

  return (
    <div className="min-h-screen bg-gray-50 pb-16" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            &larr; חזרה לרשימת השיעורים
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">נשמר אוטומטית &#10003;</span>
            <Link
              to={`/preview/${id}`}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              תצוגה מקדימה
            </Link>
          </div>
        </div>

        {/* Lesson Metadata */}
        <LessonMetadata lessonId={id} />

        {/* Source Blocks */}
        {blocks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
            <p className="text-gray-500 text-base">
              אין מקורות עדיין. הוסף מקור ראשון כדי להתחיל!
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {blocks.map((block, index) => (
              <SourceBlockEditor
                key={block.id}
                lessonId={id}
                block={block}
                index={index}
                isFirst={index === 0}
                isLast={index === blocks.length - 1}
              />
            ))}
          </div>
        )}

        {/* Add source button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => addBlock(id)}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors text-base"
          >
            + הוסף מקור
          </button>
        </div>
      </div>
    </div>
  )
}
