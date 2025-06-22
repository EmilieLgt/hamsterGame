import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-instructions',
  standalone: true,
  imports: [CommonModule, LoginComponent],
  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.scss',
})
export class InstructionsComponent {
  private router = inject(Router);
  readonly authService = inject(AuthService);

  //  contrôler l'affichage de la disquette
  displayLogin = signal(false);

  startGame() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/game']);
    } else {
      this.displayLogin.set(true);
    }
  }

  closeLoginDisquette() {
    this.displayLogin.set(false);
  }
}
