import { Routes } from '@angular/router';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { KidGamePageComponent } from './pages/kid-game-page/kid-game-page.component';

export const routes: Routes = [
  { path: '', component: GamePageComponent },
  { path: 'kid', component: KidGamePageComponent },
];
