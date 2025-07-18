import { Component, inject, signal } from '@angular/core';
import { InstructionsComponent } from '../../components/instructions/instructions.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { IScore } from '../../models/score.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [InstructionsComponent, CommonModule, RouterModule],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss',
})
export class GamePageComponent {
  readonly #apiService = inject(ApiService);
  readonly authService = inject(AuthService);

  topScores: IScore[] = [];
  scores: IScore[] = [];
  showLogin = signal(false);

  // Signals depuis AuthService
  user = this.authService.user;
  isAuthenticated = this.authService.isAuthenticated;

  openLogin() {
    this.showLogin.set(true);
  }

  closeLogin() {
    this.showLogin.set(false);
  }

  async saveScore(months: number, hamsters: number) {
    if (!this.isAuthenticated()) {
      this.openLogin();
      return;
    }

    const userName = this.authService.getUserName();
    const userId = this.authService.getUserId();

    try {
      await this.#apiService.addScore({
        months,
        hamsters,
        user_name: userName!,
      });

      // Recharger les scores
      this.scores = await this.#apiService.getAllScores(10);
    } catch (error) {
      console.error('Erreur sauvegarde score:', error);
    }
  }

  async signOut() {
    await this.authService.signOut();
  }
}
