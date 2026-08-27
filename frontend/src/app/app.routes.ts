import { Routes } from '@angular/router';
import { Landing } from './features/landing/components/landing/landing';
import { Login } from './features/auth/components/login/login';
import { Register } from './features/auth/components/register/register';
import { Leaderboard } from './features/leaderboard/components/leaderboard/leaderboard';
// import { Game } from './features/game/game.component'; // صفحة اللعبة عندك
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  // },
  // { path: '**', component: Landing },
  { path: '', component: Landing },

  // صفحات تسجيل الدخول
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // صفحة اللعبة - مسموح بها للمسجلين فقط
  // { path: 'game', component: Game, canActivate: [authGuard] },

  {
    path: 'leaderboard',
    component: Leaderboard,
    canActivate: [authGuard],
  },
  // توجيه أي مسار خاطئ للرئيسية
  { path: '**', redirectTo: '' },
];
