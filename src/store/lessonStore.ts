import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Lesson, SourceBlock } from '../types';

interface LessonState {
  lessons: Lesson[];
  currentLessonId: string | null;
  createLesson: () => string;
  updateLesson: (id: string, partial: Partial<Lesson>) => void;
  deleteLesson: (id: string) => void;
  addBlock: (lessonId: string) => void;
  removeBlock: (lessonId: string, blockId: string) => void;
  moveBlockUp: (lessonId: string, blockId: string) => void;
  moveBlockDown: (lessonId: string, blockId: string) => void;
  updateBlock: (lessonId: string, blockId: string, partial: Partial<SourceBlock>) => void;
  duplicateBlock: (lessonId: string, blockId: string) => void;
  setCurrentLesson: (id: string | null) => void;
  getLessonById: (id: string) => Lesson | undefined;
  setLessons: (lessons: Lesson[]) => void;
}

export const useLessonStore = create<LessonState>()(
  persist(
    (set, get) => ({
      lessons: [],
      currentLessonId: null,

      createLesson: () => {
        const id = uuidv4();
        const now = new Date().toISOString();
        const newLesson: Lesson = {
          id,
          title: '',
          subtitle: '',
          teacherName: '',
          sourceBlocks: [],
          styleVariant: 'classic',
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          lessons: [...state.lessons, newLesson],
          currentLessonId: id,
        }));
        return id;
      },

      updateLesson: (id, partial) => {
        set((state) => ({
          lessons: state.lessons.map((lesson) =>
            lesson.id === id
              ? { ...lesson, ...partial, updatedAt: new Date().toISOString() }
              : lesson
          ),
        }));
      },

      deleteLesson: (id) => {
        set((state) => ({
          lessons: state.lessons.filter((lesson) => lesson.id !== id),
          currentLessonId:
            state.currentLessonId === id ? null : state.currentLessonId,
        }));
      },

      addBlock: (lessonId) => {
        const newBlock: SourceBlock = {
          id: uuidv4(),
          order: 0,
          sourceReference: '',
          heading: '',
          sourceText: '',
          commentary: '',
          sourceType: 'other',
        };
        set((state) => ({
          lessons: state.lessons.map((lesson) => {
            if (lesson.id !== lessonId) return lesson;
            const blocks = lesson.sourceBlocks;
            newBlock.order = blocks.length;
            return {
              ...lesson,
              sourceBlocks: [...blocks, newBlock],
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      removeBlock: (lessonId, blockId) => {
        set((state) => ({
          lessons: state.lessons.map((lesson) => {
            if (lesson.id !== lessonId) return lesson;
            const filtered = lesson.sourceBlocks
              .filter((block) => block.id !== blockId)
              .map((block, index) => ({ ...block, order: index }));
            return {
              ...lesson,
              sourceBlocks: filtered,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      moveBlockUp: (lessonId, blockId) => {
        set((state) => ({
          lessons: state.lessons.map((lesson) => {
            if (lesson.id !== lessonId) return lesson;
            const blocks = [...lesson.sourceBlocks];
            const index = blocks.findIndex((b) => b.id === blockId);
            if (index <= 0) return lesson;
            const temp = blocks[index];
            blocks[index] = blocks[index - 1];
            blocks[index - 1] = temp;
            const reordered = blocks.map((block, i) => ({
              ...block,
              order: i,
            }));
            return {
              ...lesson,
              sourceBlocks: reordered,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      moveBlockDown: (lessonId, blockId) => {
        set((state) => ({
          lessons: state.lessons.map((lesson) => {
            if (lesson.id !== lessonId) return lesson;
            const blocks = [...lesson.sourceBlocks];
            const index = blocks.findIndex((b) => b.id === blockId);
            if (index < 0 || index >= blocks.length - 1) return lesson;
            const temp = blocks[index];
            blocks[index] = blocks[index + 1];
            blocks[index + 1] = temp;
            const reordered = blocks.map((block, i) => ({
              ...block,
              order: i,
            }));
            return {
              ...lesson,
              sourceBlocks: reordered,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      updateBlock: (lessonId, blockId, partial) => {
        set((state) => ({
          lessons: state.lessons.map((lesson) => {
            if (lesson.id !== lessonId) return lesson;
            return {
              ...lesson,
              sourceBlocks: lesson.sourceBlocks.map((block) =>
                block.id === blockId ? { ...block, ...partial } : block
              ),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      duplicateBlock: (lessonId, blockId) => {
        set((state) => ({
          lessons: state.lessons.map((lesson) => {
            if (lesson.id !== lessonId) return lesson;
            const index = lesson.sourceBlocks.findIndex(
              (b) => b.id === blockId
            );
            if (index < 0) return lesson;
            const original = lesson.sourceBlocks[index];
            const duplicate: SourceBlock = {
              ...original,
              id: uuidv4(),
            };
            const newBlocks = [...lesson.sourceBlocks];
            newBlocks.splice(index + 1, 0, duplicate);
            const reordered = newBlocks.map((block, i) => ({
              ...block,
              order: i,
            }));
            return {
              ...lesson,
              sourceBlocks: reordered,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      setCurrentLesson: (id) => {
        set({ currentLessonId: id });
      },

      getLessonById: (id) => {
        return get().lessons.find((lesson) => lesson.id === id);
      },

      setLessons: (lessons) => {
        set({ lessons });
      },
    }),
    {
      name: 'source-sheets-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
