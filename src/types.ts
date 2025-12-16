
export enum ViewState {
  ONBOARDING = 'ONBOARDING',
  HOME = 'HOME',
  CANDLE = 'CANDLE',
  STREAK = 'STREAK',
  COMPANION = 'COMPANION',
  CIRCLES = 'CIRCLES',
  MEMORY = 'MEMORY',
  JOURNAL = 'JOURNAL',
  SETTINGS = 'SETTINGS',
  JOURNEY = 'JOURNEY',
  LETTERS = 'LETTERS'
}

export interface Circle {
  id: string;
  name: string;
  icon: string;
  memberCount: number;
  description: string;
  isClosed: boolean;
}

export enum MemoryStep {
  TYPE_SELECTION = 1,
  DETAILS = 2,
  CONTEXT = 3,
  REVIEW = 4
}

export interface MemoryData {
  type?: 'story' | 'photo' | 'quote' | 'favorite';
  
  // Shared
  date?: string;
  people: string[];
  location?: string;
  tags?: string[];

  // Story
  title?: string;
  text?: string;

  // Photo
  image?: string; // URL or base64
  caption?: string;

  // Quote
  quoteText?: string;
  quoteSource?: string;

  // Favorite
  category?: string;
  itemName?: string;
  reason?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface JourneyMilestone {
  id: string;
  type: 'RITUAL' | 'MEMORY' | 'CHAT' | 'CIRCLE' | 'MILESTONE';
  title: string;
  date: string;
  icon: any; // Lucide icon
  count?: number;
}

export interface Letter {
  id: string;
  recipient: string;
  deliveryDate: Date;
  content: string;
  status: 'draft' | 'sealed' | 'delivered';
  createdAt: Date;
}
