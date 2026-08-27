import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './leaderboard.html',
  styleUrls: ['./leaderboard.css'],
})
export class Leaderboard implements OnInit {
  detectives: User[] = [];
  activeTab: 'GLOBAL' | 'FRIENDS' | 'THIS_MONTH' = 'GLOBAL';

  // Pagination Variables
  currentPage: number = 1;
  pageSize: number = 10;
  totalUsers: number = 0;
  totalPages: number = 1;

  defaultAvatar = 'assets/detective1.jpg';
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadLeaderboard();
  }

  loadLeaderboard(): void {
    this.authService.getLeaderboard(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        console.log('Leaderboard Data:', res);

        if (res && res.data) {
          this.detectives = res.data.map((item: any) => ({
            username: item.userId?.username || 'Unknown Detective',
            totalScore: item.totalScore,
            casesSolved: 1,
            timeTakenSeconds: item.timeTakenSeconds,
          }));

          this.totalUsers = res.data.length;
        } else {
          this.detectives = [];
          this.totalUsers = 0;
        }

        this.totalPages = Math.ceil(this.totalUsers / this.pageSize) || 1;
      },
      error: (err) => {
        console.error('Failed to load leaderboard', err);
      },
    });
  }

  setTab(tab: 'GLOBAL' | 'FRIENDS' | 'THIS_MONTH'): void {
    this.activeTab = tab;
    // logic الفلتر
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadLeaderboard();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
