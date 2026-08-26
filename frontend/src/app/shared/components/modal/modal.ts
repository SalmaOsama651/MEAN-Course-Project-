import { Component , EventEmitter, Input, Output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-modal',
  styleUrl: './modal.css',
  templateUrl: './modal.html',
})

export class Modal {

  @Input() isOpen: boolean = false;

  @Input() title: string = '';


  @Output() closeModal = new EventEmitter<void>();

  onClose(): void {
    this.closeModal.emit();
  }
}
