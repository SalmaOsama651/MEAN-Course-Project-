export interface Case {
    _id?: string;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    storyIntro: string;
    fullSolutionStory: string;
    createdAt?: string;
    updatedAt?: string;
}