import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthHeaderComponent } from '../auth-header/auth-header';
import { RegisterRequest } from '../../../../core/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, AuthHeaderComponent],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onRegister(formData: any): void {
    if (formData.password !== formData.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    const userData: RegisterRequest = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    this.authService.register(userData).subscribe({
      next: (res) => {
        this.router.navigate(['/game']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Registration failed. Try again.';
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
