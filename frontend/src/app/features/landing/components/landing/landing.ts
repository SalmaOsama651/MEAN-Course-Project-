import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css'],
})
export class Landing implements OnInit {
  topDetectives: User[] = [];

  defaultAvatars = ['assets/detective1.jpg', 'assets/detective2.jpg', 'assets/detective3.jpg'];

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/game']);
    }

    this.fetchTopDetectives();
  }

  fetchTopDetectives(): void {
    this.authService.getTopDetectives().subscribe({
      next: (data) => {
        this.topDetectives = data;
      },
      error: (err) => {
        console.error('Failed to load top detectives:', err);
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToLeaderboard(): void {
    if (this.authService.isLoggedIn()) {
      // Redirection
      this.router.navigate(['/leaderboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
