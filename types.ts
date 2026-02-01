
export interface Beat {
  id: string;
  title: string;
  producer: string;
  genre: string;
  mood: string[];
  bpm: number;
  key: string;
  price: number;
  audioUrl: string;
  coverUrl: string;
  description: string;
  isTrending?: boolean;
  isHot?: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  suggestedBeats?: string[];
}

export enum AppSection {
  BROWSE = 'browse',
  STREAM = 'stream',
  AI_MATCH = 'ai_match',
  LYRIC_LAB = 'lyric_lab'
}
