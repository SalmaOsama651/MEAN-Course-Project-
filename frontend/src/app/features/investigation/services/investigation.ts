import { Injectable, inject } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  ApiResponse, 
  CaseDetailsData, 
  StartGameResponse, 
  StartGameRequest, 
  UnlockClueRequest 
} from '../models/investigation.model';

@Injectable({
  providedIn: 'root'
})
export class InvestigationService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api';

private authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

  // 2. تجهيز الـ Headers لإرسال التوكن مع كل Request
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`,
      'Content-Type': 'application/json'
    });
  }


  private useMockData = false ;

  private mockCaseDetails: CaseDetailsData = {
    caseDetails: {
      _id: 'case_01',
      title: 'لغز قصر الألماس المهجور',
      description: 'عُثر على رجل الأعمال متوفى داخل مكتبه المغلق في ظروف غامضة، مع اختفاء مفتاح الخزنة السرية.',
      difficulty: 'Medium',
      storyIntro: 'في ليلة عاصفة، انقطعت الكهرباء لعشر دقائق، وعند عودتها دوت صرخة من الطابق الثاني ليجد الجميع الجثة...',
      fullSolutionStory: 'تفاصيل الحل الكامل...'
    },
    suspects: [
      {
        _id: 'p1',
        caseId: 'case_01',
        name: 'فريد الألفي',
        role: 'victim',
        statement: 'المجني عليه ومالك القصر.',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=victim'
      },
      {
        _id: 'p2',
        caseId: 'case_01',
        name: 'نبيل السائق',
        role: 'suspect',
        statement: 'كنت في الجراج أقوم بتغيير إطار السيارة بسبب المطر ولم أدخل القصر إطلاقاً أثناء انقطاع الكهرباء.',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=nabil'
      },
      {
        _id: 'p3',
        caseId: 'case_01',
        name: 'د. سلوى الطبيبة',
        role: 'suspect',
        statement: 'كنت في المطبخ أعد محلول الدواء للمجني عليه، وسمعت صوت سقوط خزانة في الطابق العلوي.',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=salwa'
      },
      {
        _id: 'p4',
        caseId: 'case_01',
        name: 'عماد الحارس',
        role: 'witness',
        statement: 'رأيت ظلاً لشخص يرتدي معطفاً ثقيلاً يركض باتجاه الباب الخلفي للحديقة فور عودة التيار.',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=emad'
      }
    ],
    clues: [
      {
        _id: 'c1',
        caseId: 'case_01',
        order: 1,
        title: 'رسالة تهديد مشفرة',
        content: 'ورقة ممزقة عُثر عليها أسفل سجادة المكتب كُتب عليها: "الوقت ينفد ولن تفلت بفعلتك".',
        isUnlocked: true
      },
      {
        _id: 'c2',
        caseId: 'case_01',
        order: 2,
        title: 'بصمة طينية نادرة',
        content: 'أثر حذاء موحل مقاس 43 بالقرب من النافذة الخلفية يتطابق مع طين الحديقة السفلية.',
        isUnlocked: false
      },
      {
        _id: 'c3',
        caseId: 'case_01',
        order: 3,
        title: 'زجاجة دواء مكسورة',
        content: 'زجاجة صغيرة تحتوي على بقايا مسحوق منوم وُجدت مخبأة داخل مزهرية الصالون.',
        isUnlocked: false
      }
    ]
  };

  private mockSession: StartGameResponse = {
    gameSessionId: 'session_101',
    remainingSeconds: 300,
    unlockedClueIndex: 0
  };

  getCaseDetails(caseId: string): Observable<CaseDetailsData> {
    if (this.useMockData) {
      return of(this.mockCaseDetails);
    }
    return this.http.get<ApiResponse<CaseDetailsData>>(`${this.apiUrl}/cases/${caseId}/details`)
      .pipe(map(res => res.data));
  }



  startGame(caseId: string): Observable<StartGameResponse> {
    if (this.useMockData) {
      return of(this.mockSession);
    }
    const payload: StartGameRequest = { caseId };
    return this.http.post<ApiResponse<StartGameResponse>>(`${this.apiUrl}/game/start`, payload)
      .pipe(map(res => res.data));
    
  }

  unlockNextClue(sessionId: string): Observable<StartGameResponse> {
    if (this.useMockData) {
      this.mockSession.unlockedClueIndex++;
      return of(this.mockSession);
    }
    const payload: UnlockClueRequest = { sessionId };
    return this.http.patch<ApiResponse<StartGameResponse>>(`${this.apiUrl}/game/unlock-next-clue`, payload)
      .pipe(map(res => res.data));
  }

  // getCaseDetails(caseId: string): Observable<CaseDetailsData> {
  //   return this.http.get<ApiResponse<CaseDetailsData>>(`${this.apiUrl}/cases/${caseId}/details`, {
  //     headers: this.getHeaders()
  //   }).pipe(map(res => res.data));
  // }

  // // بدء الجلسة
  // startGame(caseId: string): Observable<StartGameResponse> {
  //   return this.http.post<ApiResponse<StartGameResponse>>(`${this.apiUrl}/game/start`, { caseId }, {
  //     headers: this.getHeaders()
  //   }).pipe(map(res => res.data));
  // }

  // // فتح الدليل
  // unlockNextClue(sessionId: string): Observable<StartGameResponse> {
  //   return this.http.patch<ApiResponse<StartGameResponse>>(`${this.apiUrl}/game/unlock-next-clue`, { sessionId }, {
  //     headers: this.getHeaders()
  //   }).pipe(map(res => res.data));
  // }
}


