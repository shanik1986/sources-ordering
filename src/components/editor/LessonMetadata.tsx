import { useLessonStore } from '../../store/lessonStore'

interface LessonMetadataProps {
  lessonId: string
}

export default function LessonMetadata({ lessonId }: LessonMetadataProps) {
  const lesson = useLessonStore((s) => s.lessons.find((l) => l.id === lessonId))
  const updateLesson = useLessonStore((s) => s.updateLesson)

  if (!lesson) return null

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
      <h2 className="text-lg font-bold text-gray-800">פרטי השיעור</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">כותרת</label>
          <input
            type="text"
            dir="rtl"
            value={lesson.title}
            onChange={(e) => updateLesson(lessonId, { title: e.target.value })}
            placeholder="שם השיעור"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">תת-כותרת</label>
          <input
            type="text"
            dir="rtl"
            value={lesson.subtitle}
            onChange={(e) => updateLesson(lessonId, { subtitle: e.target.value })}
            placeholder="נושא השיעור"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">שם המורה</label>
          <input
            type="text"
            dir="rtl"
            value={lesson.teacherName}
            onChange={(e) => updateLesson(lessonId, { teacherName: e.target.value })}
            placeholder="שם המורה/הרב"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  )
}
