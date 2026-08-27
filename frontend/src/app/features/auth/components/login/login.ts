import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthHeaderComponent } from '../auth-header/auth-header';
import { LoginRequest } from '../../../../core/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, AuthHeaderComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onLogin(formData: any): void {
    const credentials: LoginRequest = {
      email: formData.email,
      password: formData.password,
    };

    this.authService.login(credentials).subscribe({
      next: (res) => {
        // بيوديه لصفحة اللعبة
        this.router.navigate(['/game']);
      },
      // error: (err) => {
      //   this.errorMessage = err.error?.message || 'Invalid email or password.';
      // },

      error: (err) => {
        console.log('Error structure:', err); // 👈 لطباعة شكل الخطأ الكامل في الكونسول

        // التأكد من استخراج نص الخطأ مهما كان شكله
        this.errorMessage = err.error?.message || err.error || 'Invalid email or password.';
      },
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
