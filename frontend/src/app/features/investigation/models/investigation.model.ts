export interface Suspect {
  _id: string;
  caseId: string;
  name: string;
  role: 'suspect' | 'witness' | 'victim' | 'accomplice';
  statement: string;
  avatar?: string;
}

export interface Clue {
  _id: string;
  caseId: string;
  order: number;
  title: string;
  content: string;
  isUnlocked?: boolean; 
}

export interface Case {
  _id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  storyIntro: string;
  fullSolutionStory: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface CaseDetailsData {
  caseDetails: Case;
  suspects: Suspect[];
  clues: Clue[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface StartGameResponse {
  gameSessionId: string;
  remainingSeconds: number;
  unlockedClueIndex: number;
}

export interface StartGameRequest {
  caseId: string;
}

export interface UnlockClueRequest {
  sessionId: string;
}