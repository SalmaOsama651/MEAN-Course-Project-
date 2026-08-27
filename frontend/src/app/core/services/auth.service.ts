import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private tokenKey = 'auth_token';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(tap((response) => this.handleAuthSuccess(response)));
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(tap((response) => this.handleAuthSuccess(response)));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  private handleAuthSuccess(response: AuthResponse): void {
    if (response.token) {
      localStorage.setItem(this.tokenKey, response.token);
      this.currentUserSubject.next(response.user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  private loadUserFromStorage(): void {
    const token = this.getToken();
    if (token) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  getTopDetectives(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/landing`);
  }

  getLeaderboard(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/leaderboard?page=${page}&limit=${limit}`);
  }
}
