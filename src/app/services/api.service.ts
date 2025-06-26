import { inject, Injectable } from '@angular/core';
import { ApplicationRef } from '@angular/core';

import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { IUser } from '../models/user.model';
import { IScore } from '../models/score.model';
import { first } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public supabase!: SupabaseClient;

  constructor() {
    setTimeout(() => {
      const url = environment?.supabaseUrl;
      const key = environment?.supabaseKey;

      if (!url || !key) {
        throw new Error('Supabase configuration is missing');
      }

      this.supabase = createClient(url, key);
    }, 500);
  }

  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single();
  }

  // Récupérer les meilleurs scores
  async getAllScores(limit: number = 10) {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized yet');
    }
    try {
      const { data, error } = await this.supabase
        .from('SCORE')
        .select('*')
        .order('months', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Erreur lors de la récupération du top scores:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erreur getAllScores:', error);
      throw error;
    }
  }

  // Récupérer les scores d'un utilisateur spécifique
  async getUserScores(userName: string) {
    const { data, error } = await this.supabase
      .from('SCORE')
      .select('*')
      .eq('user_name', userName)
      .order('months', { ascending: false });

    if (error) {
      console.error(
        'Erreur lors de la récupération des scores utilisateur:',
        error
      );
      throw error;
    }

    return data;
  }

  // Récupérer le meilleur score d'un utilisateur
  async getUserBestScore(userName: string) {
    const { data, error } = await this.supabase
      .from('SCORE')
      .select('*')
      .eq('user_name', userName)
      .order('hamsters', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération du meilleur score:', error);
      throw error;
    }

    return data;
  }

  // Ajouter un nouveau score
  async addScore(score: Omit<IScore, 'id' | 'created_at'>) {
    const { data, error } = await this.supabase
      .from('SCORE')
      .insert(score)
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de l'ajout du score:", error);
      throw error;
    }

    return data;
  }

  // Récupérer les statistiques globales
  async getScoreStats() {
    const { data, error } = await this.supabase.rpc('get_score_stats');

    if (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }

    return data;
  }
}
