import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MonthUpdateComponent } from '../month-update/month-update.component';

@Component({
  selector: 'app-instructions',
  standalone: true,
  imports: [MonthUpdateComponent],
  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.scss',
})
export class InstructionsComponent {
  router: Router = inject(Router);
  displayAction: boolean = false;

  goToKidPage() {
    this.router.navigate(['/kid']);
  }
  startGame() {
    this.displayAction = true;
  }
}
