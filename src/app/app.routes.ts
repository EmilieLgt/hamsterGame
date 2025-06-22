import { Routes } from '@angular/router';
import { GamePageComponent } from './pages/game-page/game-page.component';
// import { KidGamePageComponent } from './pages/kid-game-page/kid-game-page.component';
import { LeaderboardPageComponent } from './pages/leaderboard-page/leaderboard-page.component';
import { authGuard } from './services/auth-guard.guard';
import { MonthUpdateComponent } from './components/month-update/month-update.component';
import { InstructionsComponent } from './components/instructions/instructions.component';

export const routes: Routes = [
  { path: '', component: InstructionsComponent },
  { path: 'leaderboard', component: LeaderboardPageComponent },
  { path: 'game', component: MonthUpdateComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
  //  { path: 'kid', component: KidGamePageComponent },
];
