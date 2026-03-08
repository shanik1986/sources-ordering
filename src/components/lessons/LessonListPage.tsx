import { useLessonStore } from '../../store/lessonStore'
import { Link, useNavigate } from 'react-router-dom'
import ImportExport from './ImportExport'

export default function LessonListPage() {
  const lessons = useLessonStore((s) => s.lessons)
  const createLesson = useLessonStore((s) => s.createLesson)
  const deleteLesson = useLessonStore((s) => s.deleteLesson)
  const navigate = useNavigate()

  const handleNewLesson = () => {
    const id = createLesson()
    navigate(`/edit/${id}`)
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm('האם למחוק את השיעור?')) {
      deleteLesson(id)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">דפי מקורות</h1>
        <button
          onClick={handleNewLesson}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + שיעור חדש
        </button>
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-xl">אין שיעורים עדיין.</p>
          <p className="text-lg mt-2">צור שיעור חדש כדי להתחיל!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              to={`/edit/${lesson.id}`}
              className="block bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition-all"
            >
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                {lesson.title || 'שיעור ללא שם'}
              </h3>
              {lesson.subtitle && (
                <p className="text-gray-600 text-sm mb-2">{lesson.subtitle}</p>
              )}
              {lesson.teacherName && (
                <p className="text-gray-500 text-sm mb-2">{lesson.teacherName}</p>
              )}
              <div className="flex items-center justify-between text-sm text-gray-400 mt-3 pt-3 border-t border-gray-100">
                <span>{lesson.sourceBlocks.length} מקורות</span>
                <span>{new Date(lesson.createdAt).toLocaleDateString('he-IL')}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <Link
                  to={`/preview/${lesson.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  תצוגה מקדימה
                </Link>
                <button
                  onClick={(e) => handleDelete(lesson.id, e)}
                  className="text-sm text-red-500 hover:text-red-700 mr-auto"
                >
                  מחק
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}

      <ImportExport />
    </div>
  )
}
