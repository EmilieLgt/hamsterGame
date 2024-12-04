import { Component } from '@angular/core';

@Component({
  selector: 'app-kid-game-page',
  standalone: true,
  imports: [],
  templateUrl: './kid-game-page.component.html',
  styleUrl: './kid-game-page.component.scss',
})
export class KidGamePageComponent {
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
}
