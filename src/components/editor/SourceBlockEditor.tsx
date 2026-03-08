import { useLessonStore } from '../../store/lessonStore'
import type { SourceBlock } from '../../types'
import RichTextEditor from './RichTextEditor'

interface SourceBlockEditorProps {
  lessonId: string
  block: SourceBlock
  index: number
  isFirst: boolean
  isLast: boolean
}

const sourceTypeLabels: Record<SourceBlock['sourceType'], string> = {
  tanach: 'תנ"ך',
  gemara: 'גמרא',
  rishonim: 'ראשונים',
  acharonim: 'אחרונים',
  other: 'אחר',
}

export default function SourceBlockEditor({
  lessonId,
  block,
  index,
  isFirst,
  isLast,
}: SourceBlockEditorProps) {
  const updateBlock = useLessonStore((s) => s.updateBlock)
  const removeBlock = useLessonStore((s) => s.removeBlock)
  const moveBlockUp = useLessonStore((s) => s.moveBlockUp)
  const moveBlockDown = useLessonStore((s) => s.moveBlockDown)
  const duplicateBlock = useLessonStore((s) => s.duplicateBlock)

  const handleDelete = () => {
    if (window.confirm('האם למחוק מקור זה?')) {
      removeBlock(lessonId, block.id)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-base font-bold text-gray-800">
          מקור {index + 1}
        </h3>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => moveBlockUp(lessonId, block.id)}
            disabled={isFirst}
            className="px-2 py-1 text-sm rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="הזז למעלה"
          >
            &uarr;
          </button>
          <button
            type="button"
            onClick={() => moveBlockDown(lessonId, block.id)}
            disabled={isLast}
            className="px-2 py-1 text-sm rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="הזז למטה"
          >
            &darr;
          </button>
          <button
            type="button"
            onClick={() => duplicateBlock(lessonId, block.id)}
            className="px-2.5 py-1 text-sm rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 transition-colors"
            title="שכפל"
          >
            שכפל
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-2.5 py-1 text-sm rounded border border-red-300 bg-white text-red-600 hover:bg-red-50 transition-colors"
            title="מחק"
          >
            מחק
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* Source reference and type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              מקור
            </label>
            <input
              type="text"
              dir="rtl"
              value={block.sourceReference}
              onChange={(e) =>
                updateBlock(lessonId, block.id, {
                  sourceReference: e.target.value,
                })
              }
              placeholder='למשל: רש״י, בראשית א:א'
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              סוג מקור
            </label>
            <select
              dir="rtl"
              value={block.sourceType}
              onChange={(e) =>
                updateBlock(lessonId, block.id, {
                  sourceType: e.target.value as SourceBlock['sourceType'],
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {(
                Object.entries(sourceTypeLabels) as [
                  SourceBlock['sourceType'],
                  string,
                ][]
              ).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Custom heading */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            כותרת
          </label>
          <input
            type="text"
            dir="rtl"
            value={block.heading}
            onChange={(e) =>
              updateBlock(lessonId, block.id, { heading: e.target.value })
            }
            placeholder="כותרת משנית"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Source text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            טקסט המקור
          </label>
          <RichTextEditor
            content={block.sourceText}
            onChange={(html) =>
              updateBlock(lessonId, block.id, { sourceText: html })
            }
            placeholder="הדבק או הקלד את טקסט המקור כאן..."
            minHeight="120px"
          />
        </div>

        {/* Commentary */}
        <div className="bg-slate-50 rounded-lg p-4 -mx-1">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            פירוש
          </label>
          <RichTextEditor
            content={block.commentary}
            onChange={(html) =>
              updateBlock(lessonId, block.id, { commentary: html })
            }
            placeholder="הוסף פירוש או הערה..."
            minHeight="80px"
          />
        </div>
      </div>
    </div>
  )
}
