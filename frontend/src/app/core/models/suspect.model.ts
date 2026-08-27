export interface Suspect {
    _id?: string;
    caseId?: string;

    name: string;

    role:
    | 'suspect'
    | 'witness'
    | 'victim'
    | 'accomplice';

    statement: string;
    avatar?: string;
}