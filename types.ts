
export enum ViewType {
  DASHBOARD = 'dashboard',
  SOLVER = 'solver',
  VALIDATOR = 'validator',
  COLLECTIONS = 'collections',
  CREATOR = 'creator',
  CHAT = 'chat',
  IMAGE = 'image',
  SEARCH = 'search',
  ADMIN = 'admin'
}

export interface UserProfile {
  firstName: string;
  lastName: string;
}

export interface ResultEntry {
  id: string;
  firstName: string;
  lastName: string;
  collectionTitle: string;
  caseId: number;
  score: number;
  timestamp: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface Case {
  id: number;
  text: string;
  difficulty: "Oson" | "O'rta" | "Qiyin";
  correctAnswer?: string; 
}

export interface CaseCollection {
  id: string; 
  title: string;
  description: string;
  cases: Case[];
  createdAt: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: Date;
}

export interface GroundingSource {
  uri: string;
  title: string;
}
