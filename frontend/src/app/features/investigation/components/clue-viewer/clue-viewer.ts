import { Component , Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Clue } from '../../models/investigation.model';

@Component({
  imports: [CommonModule],
  selector: 'app-clue-viewer',
  styleUrl: './clue-viewer.css',
  templateUrl: './clue-viewer.html',
})
export class ClueViewer {

@Input({ required: true }) clues: Clue[] = [];
  @Output() clueFlipped = new EventEmitter<number>();

onCardClick(index: number): void {
  const clue = this.clues[index];
  if (!clue || clue.isUnlocked) return;

  const canUnlock = index === 0 || !!this.clues[index - 1]?.isUnlocked;

  if (canUnlock) {
    this.clueFlipped.emit(index);
  }
}

isClickable(index: number): boolean {
  if (this.clues[index]?.isUnlocked) return false;
  return index === 0 || !!this.clues[index - 1]?.isUnlocked;
}


}
