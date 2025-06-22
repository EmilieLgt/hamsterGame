import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Vérifier si l'utilisateur est authentifié
  if (authService.isAuthenticated()) {
    return true;
  }

  // Rediriger vers la page d'accueil si non authentifié
  router.navigate(['/']);
  return false;
};

// Guard inverse pour éviter l'accès aux pages d'auth si déjà connecté
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si l'utilisateur est déjà connecté, rediriger vers le jeu
  if (authService.isAuthenticated()) {
    router.navigate(['/game']); 
    return false;
  }

  return true;
};