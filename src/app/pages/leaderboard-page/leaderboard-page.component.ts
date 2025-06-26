// Dans LeaderboardPageComponent
import { Component, inject, signal, OnInit } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { IScore } from '../../models/score.model';

@Component({
  selector: 'app-leaderboard-page',
  imports: [DatePipe],
  standalone: true,
  templateUrl: './leaderboard-page.component.html',
  styleUrl: './leaderboard-page.component.scss',
})
export class LeaderboardPageComponent implements OnInit {
  private readonly location = inject(Location);
  private readonly apiService = inject(ApiService);

  readonly scores = signal<IScore[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.getAllScore();
  }

  goBack(): void {
    this.location.back();
  }

  async getAllScore(): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);
      await this.waitForSupabaseClient();

      const scoresData = await this.apiService.getAllScores(100);
      this.scores.set(scoresData || []);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des scores:', error);
      this.error.set('Impossible de charger les scores');

      // Retry automatique si le client n'est pas prêt
      if (error.message?.includes('not initialized')) {
        console.log('Client non initialisé, retry...');
        setTimeout(() => this.getAllScore(), 500);
      }
    } finally {
      this.loading.set(false);
    }
  }
  private async waitForSupabaseClient(): Promise<void> {
    let retries = 0;
    const maxRetries = 20; 

    while (!this.apiService.supabase && retries < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      retries++;
    }

    if (!this.apiService.supabase) {
      throw new Error('Supabase client failed to initialize');
    }
  }
}
