import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../../services/auth.service';
import { DemineurComponent } from '../demineur/demineur.component';

@Component({
  selector: 'app-instructions',
  standalone: true,
  imports: [CommonModule, LoginComponent, DemineurComponent],
  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.scss',
})
export class InstructionsComponent {
  private router = inject(Router);
  readonly authService = inject(AuthService);

  showDemineur = signal(false);

  //  affichage de la disquette
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
  openDemineur() {
    this.showDemineur.set(!this.showDemineur());
  }
}
