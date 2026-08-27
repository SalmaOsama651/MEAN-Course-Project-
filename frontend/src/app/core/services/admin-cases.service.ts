import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Case } from '../models/case.model';
import { Clue } from '../models/clue.model';
import { Question } from '../models/question.model';
import { Suspect } from '../models/suspect.model';

@Injectable({
    providedIn: 'root',
})
export class AdminCasesService {
    private readonly apiUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }

    // ================= CASES =================

    getCases(): Observable<{ message: string; data: Case[] }> {
        return this.http.get<{ message: string; data: Case[] }>(
            `${this.apiUrl}/cases`
        );
    }

    getCaseDetails(id: string): Observable<{
        success: boolean;
        data: {
            caseDetails: Case;
            suspects: Suspect[];
            clues: Clue[];
            questions: Question[];
        };
    }> {
        return this.http.get<{
            success: boolean;
            data: {
                caseDetails: Case;
                suspects: Suspect[];
                clues: Clue[];
                questions: Question[];
            };
        }>(`${this.apiUrl}/cases/${id}/details`);
    }

    createCase(data: any): Observable<any> {
        return this.http.post(
            `${this.apiUrl}/admin/cases`,
            data
        );
    }

    updateCase(id: string, data: Partial<Case>): Observable<any> {
        return this.http.put(
            `${this.apiUrl}/admin/cases/${id}`,
            data
        );
    }

    deleteCase(id: string): Observable<any> {
        return this.http.delete(
            `${this.apiUrl}/admin/cases/${id}`
        );
    }

    // ================= CLUES =================

    createClue(data: Partial<Clue>): Observable<any> {
        return this.http.post(
            `${this.apiUrl}/admin/clues`,
            data
        );
    }

    updateClue(
        id: string,
        data: Partial<Clue>
    ): Observable<any> {
        return this.http.put(
            `${this.apiUrl}/admin/clues/${id}`,
            data
        );
    }

    deleteClue(id: string): Observable<any> {
        return this.http.delete(
            `${this.apiUrl}/admin/clues/${id}`
        );
    }

    // ================= QUESTIONS =================

    createQuestion(
        data: Partial<Question>
    ): Observable<any> {
        return this.http.post(
            `${this.apiUrl}/admin/questions`,
            data
        );
    }

    updateQuestion(
        id: string,
        data: Partial<Question>
    ): Observable<any> {
        return this.http.put(
            `${this.apiUrl}/admin/questions/${id}`,
            data
        );
    }

    deleteQuestion(id: string): Observable<any> {
        return this.http.delete(
            `${this.apiUrl}/admin/questions/${id}`
        );
    }

    // ================= SUSPECTS =================

    createSuspect(
        data: Partial<Suspect>
    ): Observable<any> {
        return this.http.post(
            `${this.apiUrl}/admin/suspects`,
            data
        );
    }

    updateSuspect(
        id: string,
        data: Partial<Suspect>
    ): Observable<any> {
        return this.http.put(
            `${this.apiUrl}/admin/suspects/${id}`,
            data
        );
    }

    deleteSuspect(id: string): Observable<any> {
        return this.http.delete(
            `${this.apiUrl}/admin/suspects/${id}`
        );
    }
}   