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
    this.loadStoredUser();

    // effect(() => {
    //   const user = this.user();
    //   if (user && (this.router.url === '/' || this.router.url === '/login')) {
    //     this.router.navigate(['/game']);
    //   }
    // });
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

  // ✅ INSCRIPTION AVEC HASH CÔTÉ SERVEUR
  async signUp(pseudo: string, password: string) {
    this.updateAuthState({ loading: true, error: null });

    try {
      // Appeler la fonction Supabase qui hash le mot de passe
      const { data, error } = await this.apiService.supabase.rpc(
        'create_user_with_hashed_password',
        {
          user_name: pseudo,
          plain_password: password,
        }
      );

      if (error) throw error;

      const result = data[0]; // La fonction retourne un tableau avec un élément

      if (!result.success) {
        throw new Error(result.message);
      }

      // Stocker l'utilisateur
      const user = { id: result.id, name: result.name };
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

  // ✅ CONNEXION AVEC VÉRIFICATION DE HASH CÔTÉ SERVEUR
  async signIn(pseudo: string, password: string) {
    this.updateAuthState({ loading: true, error: null });

    try {
      // Appeler la fonction Supabase qui vérifie le mot de passe hashé
      const { data, error } = await this.apiService.supabase.rpc(
        'authenticate_user',
        {
          user_name: pseudo,
          plain_password: password,
        }
      );

      if (error) throw error;

      const result = data[0]; // La fonction retourne un tableau avec un élément

      if (!result.success) {
        throw new Error(result.message);
      }

      // Stocker l'utilisateur
      const user = { id: result.id, name: result.name };
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

  // DÉCONNEXION
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

  // Méthodes helpers (pas de changement)
  getUserId(): string | null {
    return this.user()?.id ?? null;
  }

  getUserName(): string | null {
    return this.user()?.name ?? null;
  }

  getUserEmail(): string | null {
    return this.getUserName();
  }
}
