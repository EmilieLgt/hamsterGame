import { Component } from '@angular/core';
import { MonthUpdateComponent } from '../month-update/month-update.component';

@Component({
  selector: 'app-instructions',
  standalone: true,
  imports: [MonthUpdateComponent],
  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.scss',
})
export class InstructionsComponent {
  displayAction: boolean = false;

  startGame() {
    this.displayAction = true;
  }
}
