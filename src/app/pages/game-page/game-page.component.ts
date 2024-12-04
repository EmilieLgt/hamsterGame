import { Component } from '@angular/core';
import { InstructionsComponent } from "../../components/instructions/instructions.component";

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [InstructionsComponent],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss'
})
export class GamePageComponent {

}
