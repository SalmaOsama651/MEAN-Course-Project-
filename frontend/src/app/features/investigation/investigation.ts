import { Component, OnInit, OnDestroy, inject , signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InvestigationService } from './services/investigation';
import { Case, Clue, Suspect } from './models/investigation.model';
import { TimerPipe } from '../../shared/pipes/timer-pipe';
import { Modal } from '../../shared/components/modal/modal';
import { ClueStepper } from './components/clue-stepper/clue-stepper'
import { ClueViewer } from './components/clue-viewer/clue-viewer';
import { SuspectCard } from './components/suspect-card/suspect-card';


@Component({
  imports: [
CommonModule, 
    TimerPipe, 
    Modal,
    ClueStepper,
    ClueViewer ,
    SuspectCard
  ],
  selector: 'app-investigation',
  styleUrl: './investigation.css',
  templateUrl: './investigation.html',
})
export class Investigation implements OnInit, OnDestroy {
private investigationService = inject(InvestigationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  caseId: string = 'case_01';
  sessionId: string = '';
  testClues: Clue[] = [];
 
  // دالة قلب الكارت عند الضغط عليه
   onClueFlipped(index: number): void {
    if (!this.testClues[index].isUnlocked) {
      this.testClues[index].isUnlocked = true;
      this.testClues = [...this.testClues];

      // إشعار السيرفر بفتح الدليل لو في جلسة شغالة
      if (this.sessionId) {
        this.investigationService.unlockNextClue(this.sessionId).subscribe();
      }
    }
  }


//////////////////////////////////////////
//Suspects

mockSuspects: Suspect[] = [];
  // 2. فلترة الضحية والمشتبه بهم
  get victim(): Suspect | undefined {
    return this.mockSuspects.find(s => s.role === 'victim');
  }

  get suspects(): Suspect[] {
    return this.mockSuspects.filter(s => s.role !== 'victim');
  }

  // 3. لوجيك التحكم في المودال
  selectedSuspect: Suspect | null = null;
  isSuspectModalOpen: boolean = false;

  openSuspectModal(suspect: Suspect): void {
    this.selectedSuspect = suspect;
    this.isSuspectModalOpen = true;
  }

  closeSuspectModal(): void {
    this.isSuspectModalOpen = false;
    this.selectedSuspect = null;
  }

  //////////////////////////////////////////
  mockCaseInfo :Case | null = null;

/////////////////////////////////////////////////////

readonly TOTAL_TIME: number = 600;
remainingTime = signal<number>(this.TOTAL_TIME);
private timerInterval: any = null;
// التحقق من فتح جميع الأدلة لظهور زر الاتهام
  get allCluesUnlocked(): boolean {
    return this.testClues.length > 0 && this.testClues.every(c => c.isUnlocked);
  }

  ngOnInit(): void {
this.caseId = this.route.snapshot.paramMap.get('id') || 'case_01';
console.log(' Investigation Component Initialized with Case ID:', this.caseId);
    this.loadGameData();  }

  // تنظيف التايمر لمنع تسريب الذاكرة عند الخروج
  ngOnDestroy(): void {
    this.stopTimer();
  }

// loadGameData(): void {
//     // 1. جلب بيانات القضية والأدلة والمشتبه بهم
//     this.investigationService.getCaseDetails(this.caseId).subscribe((data) => {
//       this.mockCaseInfo = data.caseDetails;
//       this.testClues = data.clues;
//       this.mockSuspects = data.suspects;

//       // 2. بدء الجلسة واستلام الـ sessionId والوقت
//       this.investigationService.startGame(this.caseId).subscribe((session) => {
//         this.sessionId = session.gameSessionId;
//         if (session.remainingSeconds) {
//           this.remainingTime.set(session.remainingSeconds);
//         }
//         this.startTimer();
//       });
//     });
//   }

loadGameData(): void {
  // 1. جلب بيانات القضية والمشتبه بهم وعرضهم فوراً
  this.investigationService.getCaseDetails(this.caseId).subscribe({
    next: (data) => {
      console.log('✅ Case Details Loaded:', data);
      this.mockCaseInfo = data.caseDetails;
      this.testClues = data.clues || [];
      this.mockSuspects = data.suspects || [];
    },
    error: (err) => console.error('❌ Case Details Error:', err)
  });

  // 2. بدء جلسة اللعبة
  this.investigationService.startGame(this.caseId).subscribe({
    next: (session) => {
      console.log('✅ Game Session Started:', session);
      this.sessionId = session.gameSessionId;
      if (session.remainingSeconds) {
        this.remainingTime.set(session.remainingSeconds);
      }
      this.startTimer();
    },
    error: (err) => {
      console.warn('⚠️ Fallback Local Timer Started:', err);
      this.startTimer(); // يشغل التايمر حتى لو السيرفر أعطى 400 في الجلسة
    }
  });
}


startTimer(): void {
  this.stopTimer();

  this.timerInterval = setInterval(() => {
    if (this.remainingTime() > 0) {
      this.remainingTime.update(t => t - 1); 
    } else {
      this.stopTimer();
      this.openAccuse(true);
    }
  }, 1000);
}

stopTimer(): void {
  if (this.timerInterval) {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }
}

  // دالة زر الرجوع لصفحة القضايا
  goBackToCases(): void {
    this.router.navigate(['/cases']);
  }

openAccuse(isTimeUp: boolean = false): void {
  this.stopTimer();
  const timeSpent = this.TOTAL_TIME - this.remainingTime(); 
  
  this.router.navigate(['/accusation', this.caseId], {
   state: {
        sessionId: this.sessionId,
        timeSpent,
        remainingTime: this.remainingTime(),
        isTimeUp
      }
  });
}




}
