import { Component , Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Clue } from '../../models/investigation.model';


@Component({
  imports: [CommonModule],
  selector: 'app-clue-stepper',
  styleUrl: './clue-stepper.css',
  templateUrl: './clue-stepper.html',
})
export class ClueStepper {

@Input({ required: true }) clues: Clue[] = [];

  get unlockedCount(): number {
    return this.clues.filter(c => c.isUnlocked).length;
  }

get progressPercentage(): number {
    if (!this.clues || this.clues.length <= 1) return 0;
    const count = this.unlockedCount;
    if (count <= 1) return 0; // الدليل الأول يعني البداية (0%)
    
    // التمدد بين المراحل
    return ((count - 1) / (this.clues.length - 1)) * 100;
  }

}
