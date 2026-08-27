import { Component , Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Suspect } from '../../models/investigation.model';


@Component({
  imports: [CommonModule],
  selector: 'app-suspect-card',
  styleUrl: './suspect-card.css',
  templateUrl: './suspect-card.html',
})
export class SuspectCard {

@Input({ required: true }) suspect!: Suspect;
  @Input() isVictim: boolean = false;
  
  // يرسل إشعار للأب لفتح المودال وعرض التحقيق مع هذا المشتبه به
  @Output() suspectClicked = new EventEmitter<Suspect>();

  onClick(): void {
    if (!this.isVictim) {
      this.suspectClicked.emit(this.suspect);
    }
  }


}
