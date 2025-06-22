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

  ngOnInit(): void {
    this.getAllScore();
  }

  goBack(): void {
    this.location.back();
  }

  async getAllScore(): Promise<void> {
    try {
      const scoresData = await this.apiService.getAllScores();
      this.scores.set(scoresData);
    } catch (error) {
      console.error('Erreur lors de la récupération des scores:', error);
    }
  }
}
