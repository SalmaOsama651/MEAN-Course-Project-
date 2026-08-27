export interface Question {
    _id?: string;
    caseId?: string;
    questionType: 'who' | 'why' | 'how';
    questionText: string;
    options: string[];
    correctAnswer: string;
    points: number;
}