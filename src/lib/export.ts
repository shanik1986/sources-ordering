import type { Lesson } from '../types'

export function exportLessons(lessons: Lesson[]): void {
  const data = JSON.stringify(lessons, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const timestamp = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `source-sheets-${timestamp}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importLessons(file: File): Promise<Lesson[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (!Array.isArray(data)) {
          reject(new Error('קובץ לא תקין - צפוי מערך של שיעורים'))
          return
        }
        // Basic validation: each item should have id, title, sourceBlocks
        for (const item of data) {
          if (!item.id || !Array.isArray(item.sourceBlocks)) {
            reject(new Error('קובץ לא תקין - מבנה שיעור שגוי'))
            return
          }
        }
        resolve(data as Lesson[])
      } catch {
        reject(new Error('שגיאה בקריאת הקובץ'))
      }
    }
    reader.onerror = () => reject(new Error('שגיאה בקריאת הקובץ'))
    reader.readAsText(file)
  })
}
