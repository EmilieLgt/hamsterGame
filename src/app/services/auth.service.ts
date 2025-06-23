import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

export interface AuthState {
  user: { id: string; name: string } | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);

  private _authState = signal<AuthState>({
    user: null,
    loading: false,
    error: null,
  });

  readonly user = computed(() => this._authState().user);
  readonly loading = computed(() => this._authState().loading);
  readonly error = computed(() => this._authState().error);
  readonly isAuthenticated = computed(() => !!this._authState().user);

  constructor() {
    // Vérifier si un utilisateur est déjà connecté (stocké en localStorage)
    this.loadStoredUser();

    // Effect pour redirection automatique vers le jeu
    effect(() => {
      const user = this.user();
      if (user && (this.router.url === '/' || this.router.url === '/login')) {
        this.router.navigate(['/game']);
      }
    });
  }

  private loadStoredUser() {
    try {
      const storedUser = localStorage.getItem('hamster_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        this.updateAuthState({ user, loading: false, error: null });
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
      localStorage.removeItem('hamster_user');
    }
  }

  private updateAuthState(updates: Partial<AuthState>) {
    this._authState.update((current) => ({ ...current, ...updates }));
  }

  // Inscription avec pseudo/password
  async signUp(pseudo: string, password: string) {
    this.updateAuthState({ loading: true, error: null });

    try {
      // Vérifier si le pseudo existe déjà
      const { data: existingUser, error: checkError } =
        await this.apiService.supabase
          .from('USER')
          .select('name')
          .eq('name', pseudo)
          .single();

      if (existingUser) {
        throw new Error('Ce pseudo est déjà pris');
      }
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      // Créer le nouvel utilisateur
      const { data: newUser, error: insertError } =
        await this.apiService.supabase
          .from('USER')
          .insert({
            name: pseudo,
            password: password,
          })
          .select('id, name')
          .single();

      if (insertError) throw insertError;

      // Stocker l'utilisateur
      const user = { id: newUser.id, name: newUser.name };
      localStorage.setItem('hamster_user', JSON.stringify(user));

      this.updateAuthState({
        user,
        loading: false,
        error: null,
      });

      return { success: true, data: user };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur lors de l'inscription";
      this.updateAuthState({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  }

  // Connexion avec pseudo/password
  async signIn(pseudo: string, password: string) {
    this.updateAuthState({ loading: true, error: null });

    try {
      const { data: user, error } = await this.apiService.supabase
        .from('USER')
        .select('id, name')
        .eq('name', pseudo)
        .eq('password', password)
        .single();

      if (error || !user) {
        throw new Error('Pseudo ou mot de passe incorrect');
      }

      // Stocker l'utilisateur
      localStorage.setItem('hamster_user', JSON.stringify(user));

      this.updateAuthState({
        user,
        loading: false,
        error: null,
      });

      return { success: true, data: user };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur lors de la connexion';
      this.updateAuthState({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  }

  // Déconnexion
  async signOut() {
    try {
      localStorage.removeItem('hamster_user');
      this.updateAuthState({
        user: null,
        loading: false,
        error: null,
      });

      this.router.navigate(['/']);
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erreur lors de la déconnexion';
      this.updateAuthState({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }

  // Ces méthodes ne sont plus nécessaires avec le système pseudo
  async signInWithMagicLink(pseudo: string) {
    return {
      success: false,
      error: 'Fonction non disponible avec les pseudos',
    };
  }

  async resetPassword(pseudo: string) {
    return {
      success: false,
      error: 'Fonction non disponible avec les pseudos',
    };
  }

  // Méthode helper pour obtenir l'ID utilisateur
  getUserId(): string | null {
    return this.user()?.id ?? null;
  }

  // Méthode helper pour obtenir le pseudo utilisateur
  getUserName(): string | null {
    return this.user()?.name ?? null;
  }

  // Alias pour compatibilité
  getUserEmail(): string | null {
    return this.getUserName();
  }
}
