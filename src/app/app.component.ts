import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { LoginComponent } from './components/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'HamsterGame';
  readonly authService = inject(AuthService);
  readonly router = inject(Router);
  private location = inject(Location);

  private loginModal = signal(false);

  showLoginModal = this.loginModal.asReadonly();

  showBackButton() {
    return this.router.url !== '/';
  }

  openLogin() {
    this.loginModal.set(true);
  }

  closeLogin() {
    this.loginModal.set(false);
  }

  async signOut() {
    await this.authService.signOut();
  }

  goBack() {
    console.log(this.location);
    this.location.back();
  }
}
