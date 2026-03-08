import type { Lesson, SourceBlock } from '../../types'

const sourceTypeLabels: Record<SourceBlock['sourceType'], string> = {
  tanach: 'תנ"ך',
  gemara: 'גמרא',
  rishonim: 'ראשונים',
  acharonim: 'אחרונים',
  other: 'אחר',
}

const sourceTypeBadgeColors: Record<SourceBlock['sourceType'], string> = {
  tanach: 'bg-green-100 text-green-800',
  gemara: 'bg-blue-100 text-blue-800',
  rishonim: 'bg-purple-100 text-purple-800',
  acharonim: 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800',
}

function getVariantStyles(variant: string) {
  switch (variant) {
    case 'classic':
      return {
        font: 'font-frank-ruhl',
        container: 'border-2 border-amber-800/30 bg-[#fdf6e3] p-5 rounded-lg',
        header: 'text-[#1e3a5f] border-b-2 border-[#1e3a5f]/20 pb-3 mb-4',
        blockContainer: 'border border-amber-800/20 bg-white/50 rounded-lg p-4 mb-4',
        commentaryBg: 'bg-[#f0f4f8] border-r-4 border-[#1e3a5f]/30 rounded p-3 mt-3',
        commentaryLabel: 'text-[#1e3a5f] font-bold text-sm mb-1',
      }
    case 'traditional':
      return {
        font: 'font-david-libre',
        container: 'border-4 border-double border-gray-800 p-5',
        header: 'text-gray-900 border-b-2 border-gray-800 pb-2 mb-4 text-center',
        blockContainer: 'border-b border-gray-400 pb-3 mb-3',
        commentaryBg: 'bg-gray-50 border-r-4 border-gray-600 p-3 mt-2',
        commentaryLabel: 'text-gray-800 font-bold text-sm mb-1',
      }
    case 'minimal':
      return {
        font: 'font-noto-sans',
        container: 'p-5',
        header: 'border-b border-gray-200 pb-4 mb-6',
        blockContainer: 'border-b border-gray-100 pb-4 mb-4',
        commentaryBg: 'bg-gray-50 rounded p-3 mt-3',
        commentaryLabel: 'text-gray-600 font-medium text-sm mb-1',
      }
    case 'modern':
    default:
      return {
        font: 'font-noto-serif',
        container: 'p-5',
        header: 'border-b border-gray-200 pb-4 mb-6',
        blockContainer: 'bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4',
        commentaryBg: 'bg-[#f9fafb] rounded-lg p-4 mt-3 border border-gray-100',
        commentaryLabel: 'inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium mb-2',
      }
  }
}

function hasContent(html: string): boolean {
  if (!html) return false
  const stripped = html.replace(/<[^>]*>/g, '').trim()
  return stripped.length > 0
}

interface PrintableSheetProps {
  lesson: Lesson
}

export default function PrintableSheet({ lesson }: PrintableSheetProps) {
  const styles = getVariantStyles(lesson.styleVariant)
  const sorted = [...lesson.sourceBlocks].sort((a, b) => a.order - b.order)

  return (
    <div className={`print-content ${styles.font} ${styles.container}`} dir="rtl" lang="he">
      {/* Header */}
      <div className={styles.header}>
        <h1 className="text-2xl font-bold">{lesson.title || 'שיעור ללא שם'}</h1>
        {lesson.subtitle && <h2 className="text-lg mt-1 opacity-80">{lesson.subtitle}</h2>}
        {lesson.teacherName && <p className="text-sm mt-2 opacity-60">{lesson.teacherName}</p>}
      </div>

      {/* Source blocks */}
      {sorted.map((block, idx) => (
        <div key={block.id} className={`source-block ${styles.blockContainer}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-bold opacity-40">{idx + 1}.</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${sourceTypeBadgeColors[block.sourceType]}`}>
              {sourceTypeLabels[block.sourceType]}
            </span>
            {block.sourceReference && (
              <span className="font-bold text-sm">{block.sourceReference}</span>
            )}
          </div>
          {block.heading && (
            <h3 className="font-bold text-base mb-2">{block.heading}</h3>
          )}
          {hasContent(block.sourceText) && (
            <div
              className="leading-relaxed text-base"
              dangerouslySetInnerHTML={{ __html: block.sourceText }}
            />
          )}
          {hasContent(block.commentary) && (
            <div className={styles.commentaryBg}>
              <div className={styles.commentaryLabel}>פירוש</div>
              <div
                className="leading-relaxed text-sm"
                dangerouslySetInnerHTML={{ __html: block.commentary }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
