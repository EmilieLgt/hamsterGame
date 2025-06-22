import { Component, inject, OnInit, signal } from '@angular/core';
import { InstructionsComponent } from '../../components/instructions/instructions.component';
import { LoginComponent } from '../../components/login/login.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { IScore } from '../../models/score.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [InstructionsComponent, CommonModule],
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
      this.topScores = await this.#apiService.getTopScores(10);
      this.scores = await this.#apiService.getAllScores();
    } catch (error) {
      console.error('Erreur sauvegarde score:', error);
    }
  }

  async signOut() {
    await this.authService.signOut();
  }
}
