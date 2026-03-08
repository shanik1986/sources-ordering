export interface SourceBlock {
  id: string;
  order: number;
  sourceReference: string;
  heading: string;
  sourceText: string;
  commentary: string;
  sourceType: 'tanach' | 'gemara' | 'rishonim' | 'acharonim' | 'other';
}

export type StyleVariant = 'classic' | 'modern' | 'traditional' | 'minimal';

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  teacherName: string;
  sourceBlocks: SourceBlock[];
  styleVariant: StyleVariant;
  createdAt: string;
  updatedAt: string;
}
