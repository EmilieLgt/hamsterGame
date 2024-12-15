import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kid-game-page',
  standalone: true,
  imports: [],
  templateUrl: './kid-game-page.component.html',
  styleUrl: './kid-game-page.component.scss',
})
export class KidGamePageComponent {
  router: Router = inject(Router);
  goToMainPage() {
    this.router.navigate(['/']);
  }

  play: boolean = false;
  isSick: boolean = false;
  isHealthy: boolean = false;
  isBasic: boolean = true;
  setHamsterSick() {
    this.isSick = true;
    this.isBasic = false;
    this.isHealthy = false;
  }
  setHamsterHealthy() {
    this.isHealthy = true;
    this.isBasic = false;
    this.isSick = false;
  }

  setPlay() {
    this.play = true;
  }
}
