import { Component, output, input } from '@angular/core';

export interface IBonus {
  title: 'Bonus' | 'Malus';
  text: string;
}

@Component({
  selector: 'app-one-card',
  standalone: true,
  imports: [],
  templateUrl: './one-card.component.html',
  styleUrl: './one-card.component.scss',
})
export class OneCardComponent {
  cardIndex = input.required<number>();
  isFlipped = input<boolean>(false);
  bonus = input.required<IBonus>();
  selectedCardIndex = input<number | null>(null);

  cardSelected = output<number>();

  getCardState(): { isDisabled: boolean; isDimmed: boolean } {
    const selected = this.selectedCardIndex();
    const isOtherCardSelected =
      selected !== null && selected !== this.cardIndex();
    const isThisCardFlipped = this.isFlipped();

    return {
      isDisabled:
        selected !== null && (isOtherCardSelected || isThisCardFlipped),
      isDimmed: isOtherCardSelected,
    };
  }
  onCardClick() {
    if (!this.getCardState().isDisabled) {
      this.cardSelected.emit(this.cardIndex());
    }
  }
}
