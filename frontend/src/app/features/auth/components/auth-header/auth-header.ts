import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-header.html',
  styleUrls: ['./auth-header.css'],
})
export class AuthHeaderComponent {
  @Input() mode: 'login' | 'register' = 'login';
  @Input() title: string = '';
  @Input() highlightText: string = '';
  @Input() subtitle: string = '';
  @Input() buttonText: string = '';
  @Input() errorMessage: string = '';

  @Output() formSubmit = new EventEmitter<any>();
  @Output() toggleMode = new EventEmitter<void>();

  formData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
  };

  showPassword = false;
  showConfirmPassword = false;

  onSubmit(): void {
    this.formSubmit.emit(this.formData);
  }

  onSwitchMode(): void {
    this.toggleMode.emit();
  }
}
